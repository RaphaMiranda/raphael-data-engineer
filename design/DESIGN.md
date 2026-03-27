# Design System Specification: Architectural Precision

## 1. Overview & Creative North Star

### The Creative North Star: "The Blueprint Orchestrator"
This design system moves away from the "flashy" consumer dark-mode and moves toward a high-end, editorial interpretation of data infrastructure. It is rooted in **Architectural Precision**—the idea that every pixel is a deliberate data point within a larger, reliable system. 

To break the "template" look, we utilize **Intentional Asymmetry**. Projects and data visualizations should not always sit in perfectly centered containers; instead, they should leverage wide gutters and "hanging" typography (where headers bleed into the margins) to create a sophisticated, engineering-journal feel. We treat the UI as a living schematic: layered, transparent, and structurally sound.

---

## 2. Colors & Surface Logic

The palette is engineered to mimic a high-end terminal interface, using deep navy depths contrasted against vibrant "data-flow" accents.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined through:
1.  **Tonal Shifts:** Placing a `surface_container_low` card against a `surface` background.
2.  **Negative Space:** Utilizing the `20` (5rem) or `24` (6rem) spacing tokens to create mental boundaries.
3.  **Light Traps:** Using a 1px `outline_variant` at **15% opacity** only on the top and left edges to simulate a "beveled" glass edge.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers of "Synthetic Obsidian."
*   **Base:** `surface` (#0b1326) — The "floor" of the infrastructure.
*   **Environment:** `surface_container_low` — Large layout sections (e.g., a sidebar or a code-block background).
*   **Object:** `surface_container_high` — Interactive cards or modal elements.
*   **Highlight:** `surface_bright` — Active states or "hover" elevations.

### The "Glass & Gradient" Rule
To add visual "soul," primary CTAs and hero headers should utilize a **Signature Texture**:
*   **Linear Flow Gradient:** `primary` (#c0c1ff) transitioning to `primary_container` (#8083ff) at a 135-degree angle.
*   **Glassmorphism:** For floating navigation or tooltips, use `surface_container_highest` with a `backdrop-filter: blur(12px)` and an opacity of 80%.

---

## 3. Typography: Technical Authority

The typography system pairs the structural rigidity of **Space Grotesk** with the utilitarian clarity of **Inter**.

*   **Display & Headlines (Space Grotesk):** These are your "Architectural Markers." Use `display-lg` for project titles. The slightly quirky, geometric terminals of Space Grotesk suggest a "tech-forward" personality without being "gamer."
*   **Body & Labels (Inter):** High-readability sans-serif for documentation and descriptions. 
*   **Monospace (JetBrains Mono - *Recommended for Technical Details*):** Use for "on-surface-variant" text to denote metadata, like file sizes, processing times, or SQL snippets.

**Editorial Tip:** Use `label-sm` in all-caps with `letter-spacing: 0.1em` for category tags to create a "blueprinted" look.

---

## 4. Elevation & Depth

We avoid traditional material shadows in favor of **Tonal Layering** and **Ambient Glows.**

*   **The Layering Principle:** A `surface_container_lowest` element sitting inside a `surface_container_high` wrapper creates a "recessed" look, perfect for code editors or data tables.
*   **Ambient Shadows:** If an element must "float" (e.g., a dropdown), use a shadow color of `primary` at **6% opacity** with a blur of `32px`. This mimics the glow of a monitor in a dark room.
*   **The "Ghost Border":** For accessibility on interactive inputs, use `outline_variant` (#464554) at **20% opacity**. It should feel felt, not seen.

---

## 5. Components

### Buttons
*   **Primary:** Background: `Signature Gradient` (Primary to Primary Container). Text: `on_primary`. Shape: `md` (0.75rem).
*   **Secondary:** Background: `transparent`. Border: 1px `outline` at 30% opacity. Text: `primary`.
*   **Tertiary:** Background: `transparent`. Text: `secondary` (#5de6ff). No border. Used for "View Source" or "Internal Links."

### Input Fields
*   **Style:** `surface_container_lowest` background. 
*   **Bottom Border Only:** Use a 2px `outline_variant` at the bottom to mimic a "command line" input.
*   **Focus State:** The border transitions to `secondary` (#5de6ff) with a subtle `2px` outer glow.

### Cards & Lists
*   **Constraint:** **Zero Dividers.** Use `spacing.8` (2rem) to separate list items.
*   **Data Rows:** Alternate backgrounds between `surface` and `surface_container_low` for high-density data tables instead of using lines.

### Technical Components (Signature Additions)
*   **The "Status Pulse":** For "Success/Live" states, use `tertiary` (#4edea3) with a CSS animation scale-out glow.
*   **The "Grid Overlay":** Use a repeating background pattern of `outline_variant` 1px dots every `24px` on the `surface_container_lowest` to reinforce the "Architectural" vibe.

---

## 6. Do's and Don'ts

### Do:
*   **DO** use `secondary` (Cyan) and `tertiary` (Emerald) sparingly as "Data Signal" colors—only for successful builds or active flows.
*   **DO** embrace wide margins. The "Architectural" vibe requires white space (breathing room) to feel premium.
*   **DO** use Mono fonts for any numerical value (e.g., "v1.2.4" or "99.9% Uptime").

### Don't:
*   **DON'T** use pure white (#FFFFFF). Always use `on_surface` (#dae2fd) to prevent eye strain and maintain the "Deep Sea" atmosphere.
*   **DON'T** use `none` or `sm` roundedness for cards. The system requires `md` (12px) or `lg` (16px) to soften the "Brutalist" technical edges.
*   **DON'T** use heavy drop shadows. If it doesn't look like it's made of light or glass, it doesn't belong.