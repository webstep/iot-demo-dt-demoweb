# IoT DT DemoWeb
This is a simple webpage to listening on sensor in DT.
Use effects like sounds and HUE-lights for presentation of sensordata

Covers four "scenarios"
1) Presentation of Temperature data
2) Door bell
3) Theft Alarm
4) "Lysorgel" ("Close encounter of the third kind")

## Requirements:
The file apikey.ts need a few variables to use towards the REST API at Disruptive Technologies.

This file is not in git for security reasons.

filename: src/app/apikey.ts
```
export const BASIC_AUTH = 'Basic <usr:pwd Base64Encoded>;
export const PROJECT_ID = '<DisruotiveTechnology ProjectID>';
```

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.



