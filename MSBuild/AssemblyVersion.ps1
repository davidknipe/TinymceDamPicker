Param([string]$branchName, [Int]$buildCounter)

# Updates the AssemblyInformationalVersion property in the AssemblyVersion.cs file based
# on the AssemblyVersion attribute and the currently built branch

if(!$branchName -or !$buildCounter) {
    Write-Error "`$branchName and `$buildCounter paramteres must be supplied"
    exit 1
}

switch -wildcard ($branchName) {
    "master"   { $preReleaseInfo = "" }
    "master-*" { $preReleaseInfo = "" }
    "release*" { $preReleaseInfo = "-pre-{0:D6}"}
    "develop"  { $preReleaseInfo = "-ci-{0:D6}" }
    default    { $preReleaseInfo = "-feature-{0:D6}" }
}

$assemblyVersionFiles = Get-ChildItem -Path ..\ -Filter AssemblyVersion.cs -Recurse


foreach($file in $assemblyVersionFiles	) {
	$assemblyVersionFile = $file.FullName
	# Some AssemblyVersion file have more than one string match the rule
	# so get all then take the last match
	$regexGroups = (Select-String -Path $assemblyVersionFile -Pattern 'AssemblyVersion[^\d]*([\d+.]+)').Matches

	# Get the last match
	$match = $regexGroups[$regexGroups.Length-1]

	$assemblyVersion = $match.Groups[1].Value
	
	if (!$match  -or !$assemblyVersion) {
	    Write-Error "Failed to parse version information"
	    exit 1
	}
	
	$informationalVersion  = "$assemblyVersion$preReleaseInfo" -f $buildCounter

	"File: $assemblyVersionFile"
	"AssemblyVersion: $assemblyVersion"
	"AssemblyInformationalVersion: $informationalVersion"
	"branch: $branchName"
	"buildCounter: $buildCounter"

	if (!($assemblyVersionFile -like "*AddOns.Helpers*"))
	{
		# Publish the packageVersion parameter to team city
		"##teamcity[setParameter name='packageVersion' value='$informationalVersion']"
	}
	# Replace the existing AssemblyInformationalVersion with the calculated one
	$fileContent = Get-Content $assemblyVersionFile | ForEach-Object { $_ -replace ".*AssemblyInformationalVersion.*", "" }
	$OFS = "`r`n"
	Set-Content $assemblyVersionFile "$fileContent`n[assembly: AssemblyInformationalVersion(`"$informationalVersion`")]" -Force
}