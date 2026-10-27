"use strict";

const labels = { CONTROL: "Control", SCHZ: "Schizophrenia", BIPOLAR: "Bipolar", ADHD: "ADHD" };
const metricLabels = { asrs_score: "ASRS source score", hamd_17: "Hamilton 17-item source score", bart_meanadjustedpumps: "BART mean adjusted pumps" };
const format = new Intl.NumberFormat("en-AU", { maximumFractionDigits: 1 });
const byId = (id) => document.getElementById(id);
const sum = (rows, key) => rows.reduce((total, row) => total + (row[key] || 0), 0);
const people = (count) => count + (count === 1 ? " participant" : " participants");
let snapshot;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function grouped(rows, key) {
  const groups = new Map();
  rows.forEach((row) => {
    const group = groups.get(row[key]) || [];
    group.push(row);
    groups.set(row[key], group);
  });
  return [...groups.entries()];
}

function bar(label, value, maximum, annotation) {
  const row = element("div");
  const heading = element("div", undefined, "bar-head");
  heading.append(element("span", label), element("span", annotation));
  const meter = element("meter");
  meter.min = 0;
  meter.max = maximum || 1;
  meter.value = value;
  meter.setAttribute("aria-label", label + ": " + annotation);
  row.append(heading, meter);
  return row;
}

function tableRow(cells) {
  const row = element("tr");
  cells.forEach((content, index) => {
    const cell = element(index === 0 ? "th" : "td");
    if (index === 0) cell.scope = "row";
    if (content instanceof Node) cell.append(content);
    else cell.textContent = content;
    row.append(cell);
  });
  return row;
}

function render() {
  const diagnosis = byId("diagnosis").value;
  const select = (name) => snapshot.marts[name].filter((row) => !diagnosis || row.diagnosis === diagnosis);
  const cohort = select("cohort_summary");
  const assessments = select("assessment_coverage");
  const scans = select("scan_coverage");
  const population = sum(cohort, "participants");
  const expected = sum(assessments, "expected_responses");
  const observed = sum(assessments, "observed_responses");
  const localFiles = sum(scans, "local_files");
  byId("stats").replaceChildren(...[
    [population, "participants in selection"],
    [observed, "observed phenotype cells"],
    [expected ? 100 * observed / expected : 0, "% of phenotype cells observed"],
    [localFiles, "scan files in this local copy"],
  ].map(([value, label]) => {
    const stat = element("div", undefined, "stat");
    stat.append(element("strong", format.format(value)), element("span", label));
    return stat;
  }));

  byId("cohort-chart").replaceChildren(...grouped(cohort, "diagnosis").map(([code, rows]) => {
    const count = sum(rows, "participants");
    return bar(labels[code] || code, count, population, format.format(count) + " people");
  }));
  byId("cohort-note").textContent = "Mean age " + format.format(sum(cohort, "age_sum") / population) +
    " years. Gender source codes: " + grouped(cohort, "gender_source_code")
      .map(([code, rows]) => code + " " + sum(rows, "participants")).join(" / ") + ".";
  byId("scan-chart").replaceChildren(...grouped(scans, "task_code").map(([code, rows]) => {
    const listed = sum(rows, "dataset_listed");
    const people = sum(rows, "participants");
    return bar(code, listed, people, listed + " / " + people + " · " + format.format(100 * listed / people) + "%");
  }));
  byId("local-note").textContent = format.format(localFiles) + " local files in this selection. " +
    "Dataset inventory and locally downloaded files are counted separately.";

  const search = byId("instrument-search").value.trim().toLowerCase();
  const sourceRows = grouped(assessments, "instrument_code")
    .filter(([code, rows]) => (code + " " + rows[0].instrument_name).toLowerCase().includes(search))
    .sort(([left], [right]) => left.localeCompare(right));
  byId("assessment-rows").replaceChildren(...sourceRows.map(([code, rows]) => {
    const name = element("span", rows[0].instrument_name);
    name.append(element("small", code));
    const cellCount = sum(rows, "expected_responses");
    const present = sum(rows, "observed_responses");
    return tableRow([name, rows[0].variables,
      sum(rows, "participants_with_data") + " / " + sum(rows, "participants"),
      format.format(present) + " / " + format.format(cellCount),
      format.format(100 * present / cellCount) + "%"]);
  }));
  byId("assessment-status").textContent = sourceRows.length + " of " + snapshot.counts.instruments + " source tables shown.";

  byId("metric-rows").replaceChildren(...grouped(select("metric_summary"), "variable_name")
    .map(([code, rows]) => {
      const n = sum(rows, "sample_size");
      const populated = rows.filter((row) => row.sample_size > 0);
      const name = element("span", metricLabels[code] || code);
      name.append(element("small", code));
      return tableRow([name, n, n ? format.format(sum(rows, "value_sum") / n) : "No data",
        n ? format.format(Math.min(...populated.map((row) => row.min_value))) + " to " +
          format.format(Math.max(...populated.map((row) => row.max_value))) : "No data"]);
    }));
}

async function load() {
  try {
    const response = await fetch("/assets/data/ucla-warehouse.json");
    if (!response.ok) throw new Error("Snapshot request failed");
    snapshot = await response.json();
    if (!snapshot.marts || !snapshot.counts || !snapshot.quality) throw new Error("Invalid snapshot");
    grouped(snapshot.marts.cohort_summary, "diagnosis").forEach(([code]) => {
      const option = element("option", labels[code] || code);
      option.value = code;
      byId("diagnosis").append(option);
    });
    const counts = snapshot.counts;
    const quality = snapshot.quality;
    byId("quality-note").textContent = format.format(counts.participants) + " participants join across " +
      counts.instruments + " phenotype tables and " + format.format(counts.variables) +
      " source variables. " + format.format(quality.missing_responses) + " of " +
      format.format(counts.responses) + " response cells are missing. " +
      format.format(quality.unmapped_category_values) + " non-missing category values lack a dictionary label.";
    byId("event-note").textContent = "The local copy contains " + format.format(counts.local_scans) +
      " scan files across " + people(counts.local_scan_participants) + ", and " +
      format.format(counts.events) + " task-event rows from " + people(counts.local_event_participants) + ". " +
      format.format(quality.events_without_standard_onset) +
      " event rows lack the standard onset field; task-specific timings are preserved in the raw layer.";
    byId("build-date").textContent = "Snapshot built " + new Date(snapshot.generated_at)
      .toLocaleString("en-AU", { timeZone: "Australia/Sydney", timeZoneName: "short" }) + ".";
    byId("diagnosis").addEventListener("change", render);
    byId("instrument-search").addEventListener("input", render);
    render();
    byId("dashboard").hidden = false;
    byId("load-status").hidden = true;
  } catch (error) {
    byId("load-status").textContent = "The warehouse snapshot could not be loaded. Rebuild the project and serve the generated site over HTTP.";
    console.error(error);
  }
}

load();
