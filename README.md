# Battery Health Dashboard

A Vue 3 web application that helps field engineers quickly identify schools with the most tablets needing battery replacement. It processes and analyzes battery data, flagging unhealthy and unknown devices per academy.

# Features

- Parses battery logs from `battery.json`
- Groups battery data by academy and device
- Calculates average battery drain per device
- Flags devices with high battery usage (>30%/day)
- Identifies devices with unknown consumption (insufficient data)
- Renders a clean UI with unhealthy and unknown device lists
- Built with Vue 3, TypeScript, and modern libraries
- Includes unit tests for core logic

# Technologies Used

- Vue 3 + Vite
- TypeScript
- Element Plus & PrimeVue (UI Libraries)
- Pinia (state management)
- Vue Query (data layer)
- Vitest (unit testing)


# Getting Started

# 1. Install dependencies

pnpm install

# 2. Set up environment

Create a .env file in the root (if it doesn't exist) and add:

VITE_APP_BASE_PATH="/"

# 3. Run the app

pnpm dev

Visit [http://localhost:5173]

# Running Tests

pnpm test

Tests cover:

* Battery drain calculation
* Charging detection (ignored)
* Unknown usage handling

# Assumptions

* A device is unhealthy if its average drain is >30% per day
* If battery level increases between logs, we assume it was charged (and ignore the change)
* If a device has only one log, its consumption is unknown


# Scope Considerations

To stay within the time frame scope:

* No authentication
* No pagination or search
* No charts or exports

# Design Considerations

* The UI uses icons from PrimeVue for cleaner styling and accessibility.
* Each academy card gracefully handles edge cases:
* If no devices need replacement, it shows: "All devices appear healthy"
* If no unknown devices exist, it shows: "No unknown battery data for this academy"
* Dark mode toggle built with CSS variable support and transition animations
* Logo rendered in the header and favicon
* Skeleton loading was skipped because all data is from a local JSON file.

# Future Improvements

* Include healthy device count
* Add charts or visual indicators
* Export results to CSV
* Load data from a real API

# Author

Benita Daniel — [GitHub](https://github.com/swan-7)

