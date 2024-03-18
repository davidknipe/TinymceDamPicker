param ([string]$versionSuffix = "",
  [string]$configuration = "Release")
$ErrorActionPreference = "Stop"

# Set location to the Solution directory
(Get-Item $PSScriptRoot).Parent.FullName | Push-Location

[xml] $versionFile = Get-Content "./MSBuild/DependencyVersions.props"
$node = $versionFile.SelectSingleNode("Project/PropertyGroup/TinyVersion")
$tinyVersion = $node.InnerText
$parts = $tinyVersion.Split(".")
$major = [int]::Parse($parts[0]) + 2
$tinyNextMajorVersion = ($major.ToString() + ".0.0")

[xml] $versionFile = Get-Content "./MSBuild/version.props"
$pVersion = $versionFile.SelectSingleNode("Project/PropertyGroup/VersionPrefix").InnerText + $versionSuffix

Remove-Item -Path ./zipoutput -Recurse -Force -Confirm:$false -ErrorAction Ignore

New-Item -Path "./zipoutput/TinymceDamPicker" -Name "$pVersion" -ItemType "directory"
[xml] $moduleFile = Get-Content "./TinymceDamPicker/module.config"
$module = $moduleFile.SelectSingleNode("module")
$module.Attributes["clientResourceRelativePath"].Value = $pVersion
$moduleFile.Save("./zipoutput/TinymceDamPicker/module.config")
Copy-Item "./TinymceDamPicker/ClientResources" -Destination "./zipoutput/TinymceDamPicker/$pVersion/clientResources" -Recurse
Copy-Item "./TinymceDamPicker/EmbeddedLangFiles" -Destination "./zipoutput/TinymceDamPicker/$pVersion/EmbeddedLangFiles" -Recurse

$compress = @{
  Path = "./zipoutput/TinymceDamPicker/*"
  CompressionLevel = "Optimal"
  DestinationPath = "./zipoutput/TinymceDamPicker.zip"
}
Compress-Archive @compress

dotnet pack --no-restore --no-build -c $configuration /p:PackageVersion=$pVersion /p:TinyVersion=$tinyVersion /p:TinyNextMajorVersion=$tinyNextMajorVersion TinymceDamPicker.sln

Pop-Location

