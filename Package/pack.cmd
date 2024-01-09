@Echo Setting up folder structure
md Package\lib\net6.0\
md Package\contentFiles\
md Package\contentFiles\any
md Package\contentFiles\any\any
md Package\contentFiles\any\any\modules\
md Package\contentFiles\any\any\modules\_protected\
md Package\contentFiles\any\any\modules\_protected\TinymceDamPicker\

@Echo Removing old files
del /Q Package\lib\net6.0\*.*
//del /Q Package\contentFiles\*.*

@Echo Copying new files
copy ..\TinymceDamPicker\bin\Release\net6.0\TinymceDamPicker.dll Package\lib\net6.0
copy ..\TinymceDamPicker\bin\Release\net6.0\module.config Package\contentFiles\any\any\modules\_protected\TinymceDamPicker\
copy ..\TinymceDamPicker\bin\Release\net6.0\ClientResources\tinymcedampicker\plugin.js Package\contentFiles\any\any\modules\_protected\TinymceDamPicker\

@Echo Packing files
nuget.exe pack package\TinymceDamPicker.nuspec

REM @Echo Moving package
REM move /Y *.nupkg c:\project\nuget.local\