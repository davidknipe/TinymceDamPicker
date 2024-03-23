param ([string]$versionSuffix = "",
  [string]$configuration = "Release")
$ErrorActionPreference = "Stop"

# Set location to the Solution directory
$solutionDir = (Get-Item $PSScriptRoot).Parent.FullName
$buildDir = "$solutionDir/msbuild"
Write-Host "Creating TinymceDamPicker Package"

[xml] $versionFile = Get-Content "$buildDir/DependencyVersions.props"
$node = $versionFile.SelectSingleNode("Project/PropertyGroup/TinyVersion")
$tinyVersion = $node.InnerText
$parts = $tinyVersion.Split(".")
$major = [int]::Parse($parts[0]) + 2
$tinyNextMajorVersion = ($major.ToString() + ".0.0")

[xml] $versionFile = Get-Content "$buildDir/version.props"
$pVersion = $versionFile.SelectSingleNode("Project/PropertyGroup/VersionPrefix").InnerText + $versionSuffix

Remove-Item -Path "$solutionDir/zipoutput" -Recurse -Force -Confirm:$false -ErrorAction Ignore

New-Item -Path "$solutionDir/zipoutput/TinymceDamPicker" -Name "$pVersion" -ItemType "directory"
[xml] $moduleFile = Get-Content "$solutionDir/TinymceDamPicker/module.config"
$module = $moduleFile.SelectSingleNode("module")
$module.Attributes["clientResourceRelativePath"].Value = $pVersion
$moduleFile.Save("$solutionDir/zipoutput/TinymceDamPicker/module.config")
Copy-Item "$solutionDir/TinymceDamPicker/ClientResources" -Destination "$solutionDir/zipoutput/TinymceDamPicker/$pVersion/clientResources" -Recurse
Copy-Item "$solutionDir/TinymceDamPicker/EmbeddedLangFiles" -Destination "$solutionDir/zipoutput/TinymceDamPicker/$pVersion/EmbeddedLangFiles" -Recurse

$compress = @{
  Path = "$solutionDir/zipoutput/TinymceDamPicker/*"
  CompressionLevel = "Optimal"
  DestinationPath = "$solutionDir/zipoutput/TinymceDamPicker.zip"
}
Compress-Archive @compress

dotnet pack --no-restore -c $configuration /p:PackageVersion=$pVersion /p:TinyVersion=$tinyVersion /p:TinyNextMajorVersion=$tinyNextMajorVersion "$solutionDir/TinymceDamPicker.sln"
