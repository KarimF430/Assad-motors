# COMPLETE VARIANT SCHEMA - ALL 140+ FIELDS

## Basic Information (8 fields)
- `id` - String, required, unique
- `name` - String, required
- `brandId` - String, required
- `modelId` - String, required
- `price` - Number, required
- `status` - String, default: 'active'
- `description` - String
- `createdAt` - Date

## Key Features (3 fields)
- `isValueForMoney` - Boolean
- `keyFeatures` - String
- `headerSummary` - String

## Design & Styling (2 fields)
- `exteriorDesign` - String
- `comfortConvenience` - String

## Engine Specifications (14 fields)
- `engineName` - String
- `engineSummary` - String
- `engineTransmission` - String
- `enginePower` - String
- `engineTorque` - String
- `engineSpeed` - String
- `engineType` - String
- `displacement` - String
- `power` - String
- `torque` - String
- `transmission` - String
- `driveType` - String
- `fuelType` - String
- `fuel` - String

## Mileage (8 fields)
- `mileageEngineName` - String
- `mileageCompanyClaimed` - String
- `mileageCityRealWorld` - String
- `mileageHighwayRealWorld` - String
- `mileageCity` - String
- `mileageHighway` - String
- `fuelTankCapacity` - String
- `emissionStandard` - String

## Dimensions (17 fields)
- `groundClearance` - String
- `length` - String
- `width` - String
- `height` - String
- `wheelbase` - String
- `turningRadius` - String
- `kerbWeight` - String
- `frontTyreProfile` - String
- `rearTyreProfile` - String
- `spareTyreProfile` - String
- `spareWheelType` - String
- `cupholders` - String
- `bootSpace` - String
- `bootSpaceAfterFoldingRearRowSeats` - String
- `seatingCapacity` - String
- `doors` - String

## Performance (23 fields)
- `engineNamePage4` - String
- `engineCapacity` - String
- `noOfGears` - String
- `paddleShifter` - String
- `maxPower` - String
- `zeroTo100KmphTime` - String
- `topSpeed` - String
- `evBatteryCapacity` - String (Electric vehicles)
- `hybridBatteryCapacity` - String (Hybrid vehicles)
- `batteryType` - String
- `electricMotorPlacement` - String
- `evRange` - String
- `evChargingTime` - String
- `maxElectricMotorPower` - String
- `turboCharged` - String
- `hybridType` - String
- `driveTrain` - String
- `drivingModes` - String
- `offRoadModes` - String
- `differentialLock` - String
- `limitedSlipDifferential` - String
- `acceleration` - String

## Suspension & Brakes (4 fields)
- `frontSuspension` - String
- `rearSuspension` - String
- `frontBrake` - String
- `rearBrake` - String

## Wheels & Tyres (3 fields)  
- `wheelSize` - String
- `tyreSize` - String
- `spareTyre` - String

## Safety Features (29 fields)
- `globalNCAPRating` - String
- `airbags` - String
- `airbagsLocation` - String
- `adasLevel` - String (Advanced Driver Assistance Systems)
- `adasFeatures` - String
- `reverseCamera` - String
- `reverseCameraGuidelines` - String
- `tyrePressureMonitor` - String
- `hillHoldAssist` - String
- `hillDescentControl` - String
- `rollOverMitigation` - String
- `parkingSensor` - String
- `discBrakes` - String
- `electronicStabilityProgram` - String (ESP)
- `abs` - String (Anti-lock Braking System)
- `ebd` - String (Electronic Brakeforce Distribution)
- `brakeAssist` - String
- `isofixMounts` - String
- `seatbeltWarning` - String
- `speedAlertSystem` - String
- `speedSensingDoorLocks` - String
- `immobiliser` - String
- `esc` - String (Electronic Stability Control)
- `tractionControl` - String
- `hillAssist` - String
- `isofix` - String
- `parkingSensors` - String
- `parkingCamera` - String
- `blindSpotMonitor` - String

## Comfort & Convenience (27 fields)
- `ventilatedSeats` - String
- `sunroof` - String
- `airPurifier` - String
- `headsUpDisplay` - String (HUD)
- `cruiseControl` - String
- `rainSensingWipers` - String
- `automaticHeadlamp` - String
- `followMeHomeHeadlights` - String
- `keylessEntry` - String
- `ignition` - String (Push button start/Key)
- `ambientLighting` - String
- `steeringAdjustment` - String
- `airConditioning` - String (Manual/Automatic)
- `climateZones` - String
- `climateControl` - String
- `rearACVents` - String
- `frontArmrest` - String
- `rearArmrest` - String
- `insideRearViewMirror` - String
- `outsideRearViewMirrors` - String
- `steeringMountedControls` - String
- `rearWindshieldDefogger` - String
- `frontWindshieldDefogger` - String
- `cooledGlovebox` - String
- `pushButtonStart` - String
- `powerWindows` - String
- `powerSteering` - String

## Infotainment (16 fields)
- `touchScreenInfotainment` - String
- `androidAppleCarplay` - String
- `speakers` - String (Number)
- `tweeters` - String (Number)
- `subwoofers` - String (Number)
- `usbCChargingPorts` - String
- `usbAChargingPorts` - String
- `twelvevChargingPorts` - String (12V)
- `wirelessCharging` - String
- `infotainmentScreen` - String (Size)
- `bluetooth` - String
- `usb` - String
- `aux` - String
- `androidAuto` - String
- `appleCarPlay` - String

## Lighting (8 fields)
- `headLights` - String (Halogen/LED/Projector)
- `tailLight` - String (LED/Bulb)
- `frontFogLights` - String
- `daytimeRunningLights` - String (DRL)
- `headlights` - String (duplicate field)
- `drl` - String (duplicate field)
- `fogLights` - String (duplicate field)
- `tailLights` - String (duplicate field)

## Exterior (7 fields)
- `roofRails` - String
- `radioAntenna` - String
- `outsideRearViewMirror` - String (ORVM)
- `sideIndicator` - String
- `rearWindshieldWiper` - String
- `orvm` - String (duplicate field)
- `alloyWheels` - String

## Seating (7 fields)
- `seatUpholstery` - String (Fabric/Leather)
- `seatsAdjustment` - String
- `driverSeatAdjustment` - String
- `passengerSeatAdjustment` - String
- `rearSeatAdjustment` - String
- `welcomeSeats` - String
- `memorySeats` - String

## Additional (3 fields)
- `warranty` - String
- `connectedCarTech` - String
- `highlightImages` - Array of { url: String, caption: String }

---

## TOTAL FIELD COUNT: 142 Fields

### Breakdown by Category:
1. Basic Information: 8
2. Key Features: 3
3. Design: 2
4. Engine: 14
5. Mileage: 8
6. Dimensions: 17
7. Performance: 23
8. Suspension & Brakes: 4
9. Wheels & Tyres: 3
10. Safety: 29
11. Comfort & Convenience: 27
12. Infotainment: 16
13. Lighting: 8
14. Exterior: 7
15. Seating: 7
16. Additional: 3

**TOTAL: 169 fields** (including duplicate fields)

**Note**: Some fields are duplicated (e.g., headlights/headLights, drl/daytimeRunningLights) for backward compatibility.

**Unique Fields: ~142**
