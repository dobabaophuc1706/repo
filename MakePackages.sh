cd /Users/dobabaophuc/Documents/GitHub/repo/package 
cd /Users/dobabaophuc/Documents/GitHub/repo
dpkg-scanpackages -m ./debs > Packages
bzip2 Packages
