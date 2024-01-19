# Optimizely DAM picker button for TinyMCE for Optimizely CMS 12

Optimizely DAM picker button for TinyMCE for Optimizely CMS 12

## Features

Adds a button to the TinyMCE toolbar to select images from the Optimizely DAM and ensure assets are tracked in the lineage in Optimizely DAM

![Visual Compare mode for Optimizely CMS](/docs/tinymce-dam-picker-button.png?raw=true)

----

## Installation

Install the package directly from the Optimizely Nuget repository.

``` 
dotnet add package TinymceDamPicker
```
```
Install-Package TinymceDamPicker
```

## Configuration (.NET 6.0+)

*Startup.cs*
``` c#
// Adds the DAM selector button
services.AddDamSelectButton();
```
 ---
 ## Version History

 |Version| Details|
 |:---|:---------------|
 |1.0|Initial Release|
 |1.1|Added support to lineage API|
