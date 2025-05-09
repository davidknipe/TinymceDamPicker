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

 | Version | Details                                                                        |
 |:--------|:-------------------------------------------------------------------------------|
 | 1.2.6   | Adding support for EPiServer.CMS.TinyMce 5.0                                   | 
 | 1.2.5   | Bug fix: Prevent multi-select. Thanks for the contribution AnnamalaiEswaran-A! | 
 | 1.2.4   | Bug fix: Ensure auto-save works when in forms view                             | 
 | 1.2.3   | Bug fix: Resolve issue where multiple images cannot be inserted                | 
 |         | without a UI refresh                                                           |
 | 1.2.2   | Bug fix: Resolve issue where relative CMS UI path may not be resolved          |
 | 1.2.1   | Bug fixes:                                                                     |
 |         | - Insert image may fail if CMS UI hasn't finished updating                     |
 |         | - Clicking the insert button when editing an existing image fails              |
 | 1.2     | Supports EPiServer.CMS.TinyMce 3.x and 4.x                                     |
 | 1.1     | Added support to lineage API                                                   |
 | 1.0     | Initial Release                                                                |
