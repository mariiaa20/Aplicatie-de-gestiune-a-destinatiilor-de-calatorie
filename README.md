# Aplicatie-de-gestiune-a-destinatiilor-de-calatorie
# Travel Destinations Manager
An application that helps users manage and organize their travel destinations.

## Data model
| Field | Type | Notes |
|---|---|---|
| Destination Name | text | required, max 100 chars |
| Visited | boolean | toggled from the list, default false |
| Location Type | fixed values | Beach, Mountain, City Break |
| Trip Category | relation | Vacation, Business |
| Traveler | relation | the owner of the item |

Sample data used across all stages:
1. Paris, active, City Break
2. Maldives, done, Beach
3. Swiss Alps, active, Mountain

## How to run
Open `index.html` in a browser. No build step, no server.

## AI usage
| Tool | Used for |
|---|---|
| ChatGPT / Gemini | Generating the initial README structure and adapting the data model |

Details per stage:
* Stage 1: see the ai-log/ folder.

## Status
- [x] Stage 1: static mockup
- [ ] Stage 2: data logic in JavaScript
