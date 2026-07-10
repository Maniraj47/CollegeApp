require 'xcodeproj'

project_path = 'ios/CollegeApp.xcodeproj'
project = Xcodeproj::Project.open(project_path)

# Find the main group (usually named after the project)
main_group = project.main_group.find_subpath(File.join('CollegeApp'), true)

# Create a file reference for the plist
file_ref = main_group.new_reference('GoogleService-Info.plist')

# Add it to the first target (usually the main app target)
target = project.targets.first
target.add_file_references([file_ref])

project.save
puts "Added GoogleService-Info.plist to #{project_path}"
