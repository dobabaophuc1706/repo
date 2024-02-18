// Function to return all different categories and amount of tweaks in them
function returnCategoryCount(packages) {
    // Define Variables
    let categories = []
    let contains = false
    // Loop through all categories dump (duplicates in one giant array)
    for (i=0; i<packages.length; i++) {
        var tempCategoryName = packages[i].Section
        contains = false
        // Loop through existing categories
        for (j=0; j<categories.length; j++) {
            // If already in existing category, increment the counter
            if (categories[j].name == tempCategoryName) {
                contains = true
                categories[j].tweakCount += 1
            }
        }
        // If not in existing category, add it to it.
        if (!contains) {
            var tempCategory = {}
            tempCategory.name = tempCategoryName
            tempCategory.tweakCount = 1
            categories.push(tempCategory)
        }
    }
    // Sort categories alphabetically by name field
    categories.sort(function(a, b) {
        return a.name.localeCompare(b.name);
    });
    // Return categories into array of objects
    return categories
}

// Function to decode Packages File
function decodePackagesFile(packagesFile) {
    // Define packageObjects (new array for package objects to be placed)
    var packageObjects = []
    // Clean empty lines out of packages File
    packagesFile = packagesFile.replace(/^\s*[\r\n]/gm,"")
    // Split PackagesFile into Packages
    let packages = packagesFile.split("Package:")
    // Remove first blank from Packages
    packages.shift()
    // Loop through packages and convert them to objects
    for (packageNum = 0; packageNum < packages.length; packageNum++) {
        // Define the package
        let package = {}
        // Set the package's bundle ID property
        Object.defineProperty(package, "Package", {
            value: packages[packageNum].split('\n', 1)[0].replace(" ","")
        })
        // Remove Bundle ID line from Package String
        packages[packageNum] = packages[packageNum].slice(packages[packageNum].indexOf('\n') + 1)
        // Get all remaining properties of package
        let properties = packages[packageNum].split("\n")
        for (i=0; i<properties.length; i++) {
            // Extract Property Name from before first colon
            let propertyName = properties[i].substring(0, properties[i].indexOf(":"))
            // Extract Property Value from after first colon
            let propertyValue = properties[i].substring(properties[i].indexOf(":") + 2, properties[i].length)
            // Try catch incase repo maintainer accidently wrote a property twice
            try {
                // Set the property within the object
                Object.defineProperty(package, propertyName, {
                    value: propertyValue
                })
            } catch (error) {
                console.log("Note to developer: Your packages file is messed up!")
            }
        }
        // Add package object into array of packages
        packageObjects.push(package)
    }
    // Return Packages
    return packageObjects
}