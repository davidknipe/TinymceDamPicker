@Echo Setting up folder structure
md Package\lib\net6.0\
md Package\contentFiles\any\any\modules\_protected\TinymceDamPicker\
md Package\docs\

@Echo Removing old files
del /Q Package\lib\net6.0\*.*
del /Q Package\contentFiles\*.*
del /Q Package\docs\*.*

@Echo Copying new files
copy ..\TinymceDamPicker\bin\Release\net6.0\TinymceDamPicker.dll Package\lib\net6.0
copy ..\TinymceDamPicker\bin\Release\net6.0\module.config Package\contentFiles\any\any\modules\_protected\TinymceDamPicker\
copy ..\TinymceDamPicker\bin\Release\net6.0\ClientResources\tinymcedampicker\plugin.js Package\contentFiles\any\any\modules\_protected\TinymceDamPicker\
copy ..\README.md Package\docs\
copy dam-select-icon.png Package\docs\

@Echo Packing files
nuget.exe pack package\TinymceDamPicker.nuspec

REM @Echo Moving package
move /Y *.nupkg F:\_addOnsTest\