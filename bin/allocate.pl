#! /usr/bin/perl
#use strict;
#use warnings;
use Data::Dumper;
use List::MoreUtils qw(firstidx uniq);
use FindBin;
use lib "$FindBin::Bin/../lib";
use studentAllocation;
use List::Util qw(shuffle);

# Student allocation algorithm
# Richard D. Morey, 18 March 2013

# Implementation of algorithm of:
# Abraham, D.J., Irving, R.W. and Manlove, D.M. (2007)        
# Two algorithms for the student-project allocation problem.   
# Journal of Discrete Algorithms, 5  (1).   pp. 73-90.         
# http://dx.doi.org/10.1016/j.jda.2006.03.006              

# CONFIGURATION ###########################################################

# print updates?
my $updates      = 1; # 0 for no updates 

# distribute unassigned at the end?
my $distributeUnassigned = 1;

# Define file names for input 
my $studentsFN   = "../input/students.txt";
my $lecturersFN  = "../input/lecturers.txt";
my $projectsFN   = "../input/projects.txt";

# Define file name for output 
# These files will be overwritten! 
my $outStudentsFN  = "../output/studentAssignments.txt";
my $outProjectsFN  = "../output/projectAssignments.txt";
my $outLecturersFN = "../output/lecturerAssignments.txt";

# Change random seed for shuffling of students and projects
my $randomize    = 0; # If 0, no randomization
my $seed         = 1;

# Which algorithm to run?
my $algo = "spa-student"; #only possible value is "spa-student" right now.

# Limit the number of iterations performed? -1 for no limit
my $iterationLimit = -1;

# END CONFIGURATION ######
# Do not edit anything below this line unless you know what you are doing
############################################################################

srand $seed;

my %studPrefs  = ( ); # student preferences for projects
my %origStudPrefs  = ( ); # student preferences for projects (immutable)
my %lectPrefs  = ( ); # lecturer preferences for students
my %lectCap    = ( ); # lecturer capacities
my %projLect   = ( ); # hash with projects as keys, and corresponding lecturer as elements
my %lectProj   = ( ); # hash with lecturers as keys, and corresponding project arrays as elements
my %projCap    = ( ); # project capacities
my %projectedPrefs = ( ); # "Projected" preferences for projects, L^j_k

# algorithm output
my %studAssignments = ( ); 
my %projAssignments = ( );
my %lectAssignments = ( );
my @unassignedStudents;

# some working variables
my $key;
my $cap;
my $value;
my $lect;

# Open files for reading 
open ( STUDENTS, "<", $studentsFN ) or die("Could not open students file $studentsFN : $!");
open ( LECTURERS, "<", $lecturersFN ) or die("Could not open lecturers file $lecturersFN : $!");
open ( PROJECTS, "<", $projectsFN ) or die("Could not open projects file $projectsFN : $!");

# Read in files, create hashes containing the data 
while( <STUDENTS> )
{
	chomp($_);
	@_ = split( /\s+/, $_ );
	$key = shift(@_);
	die ("Error: duplicate student found in $studentsFN: $key\n") if exists $studPrefs{ $key };
	@{$studPrefs{ $key }} = uniq @_;
	@{$origStudPrefs{ $key }} = uniq @_;
	push(@unassignedStudents, $key);
}
close STUDENTS;

while(<LECTURERS>)
{
	chomp($_);
	@_ = split( /\s+/, $_ );	
	$key = shift(@_);
	die ("Error: duplicate lecturer found in $lecturersFN: $key\n") if exists $lectPrefs{ $key };
	$cap = shift(@_);
	@{$lectPrefs{ $key }} = uniq @_;
	$lectCap{ $key } = $cap;
}
close LECTURERS;

while(<PROJECTS>)
{
	chomp($_);
	@_ = split( /\s+/, $_ );	
	($key, $cap, $lect) = @_;
	die ("Error: duplicate project found in $projectsFN: $key\n") if exists $projLect{ $key };
	$projLect{ $key } = $lect;
	$projCap{ $key } = $cap;
	push( @{$lectProj{ $lect }}, $key );
}
close PROJECTS;
# END read in files 

################
# check the input for inconsistencies
###

# Make sure projects preferred by the students all exist
while (($key, $value) = each(%studPrefs)){
	foreach( @{$value} ){	
		exists $projCap{ $_ } or die("Student $key preferred project $_ did not exist in project file."); 
	}
}

# Make sure students preferred by the lecturers all exist
while (($key, $value) = each(%lectPrefs)){
	foreach( @{$value} ){	
		exists $studPrefs{ $_ } or die("Lecturer $key preferred student $_ did not exist in student file."); 
	}
}

# Make sure all projects have valid lecturers
while (($key, $value) = each(%projLect)){
	exists $lectPrefs{ $value } or die("Project $key lecturer $_ did not exist in lecturer file."); 
}

# Make sure capacities are all > 0
while (($key, $value) = each(%projCap)){
	($value > 0) or die("Project $key capacity < 1 ($value)."); 
}
while (($key, $value) = each(%lectCap)){
	($value > 0) or die("Lecturer $key capacity < 1 ($value)."); 
}
############### END input checking


# Create projected preference list - first pass; add students not on lecturer's list
while (($key, $value) = each(%studPrefs)){
	foreach my $project (@{$value}){
		my $idx = firstidx { $_ eq $key } @{$lectPrefs{$projLect{$project}}};
		if($idx == -1){
			push(@{$lectPrefs{$projLect{$project}}}, $key);
		}
	}	
}
# Create projected preference list - second pass; add students to projected list
while (($key, $value) = each(%projLect)){
	foreach my $student (@{$lectPrefs{$value}}){
		my $idx = firstidx { $_ eq $key } @{$studPrefs{$student}};
		push( @{$projectedPrefs{ $key }}, $student) if($idx>-1);
	}
}


@unassignedStudents = shuffle(@unassignedStudents) if($randomize);

my $done = 0;
my $iters = 0;
my $nProj;
my $currentStudent;
my $currentProject;
my $currentLecturer;
my $worst;
my $worstProj;
my $idx;
my $maxIdx;




# This is a direct implementation of the pseudocode in Fig. 2. There is probably a more
# efficient way of doing it.
# BEGIN ALGORITHM
while ( !$done ){
	$iters++;
	exit if( ($iters>$iterationLimit) && ($iterationLimit != -1) );
	# If we have any unassigned students
	if( scalar @unassignedStudents ) {
		# check their list of projects
		foreach $value ( @unassignedStudents ){
			# How many projects does this unallocated student have in their list?
			$currentStudent = $value;
			$nProj = scalar @{$studPrefs{$currentStudent}};
			last if($nProj > 0); # Break out of loop and continue if they have any projects
		}
		if( $nProj > 0 ){ ### We have a student who still has projects in their list
			##### Heart of algorithm.

			$currentProject = @{$studPrefs{$currentStudent}}[0];					
			$currentLecturer = $projLect{$currentProject};
			
			# Assign student to the project
			push(@{$projAssignments{$currentProject}}, $currentStudent);
			push(@{$lectAssignments{$currentLecturer}}, $currentStudent);
			$studAssignments{ $currentStudent } = $currentProject;
			
			# remove from unassigned students
			$idx = firstidx { $_ eq $currentStudent } @unassignedStudents;
			splice(@unassignedStudents, $idx, 1);
			
			if($updates){
				print "$iters: Assigned $currentStudent to project $currentProject of $currentLecturer.\n";
			}
			
			# Check to see if project is overloaded
			if( (scalar @{$projAssignments{$currentProject}}) > $projCap{$currentProject}){

				
				$worst = findWorst($currentStudent, \@{$projectedPrefs{$currentProject}}, 
								\@{$projAssignments{$currentProject}});				
				
				if($updates){			
					print "Project $currentProject is overloaded. Removing $worst.\n";
				}
				
				breakAssociation($worst, \@{$lectAssignments{$currentLecturer}}, 
								\@{$projAssignments{$currentProject}}, 
								\%studAssignments,
								\@unassignedStudents);				
				
			}
			# Check to see if lecturer is overloaded
			if( (scalar @{$lectAssignments{$currentLecturer}}) > $lectCap{$currentLecturer}){
				
				$worst = findWorst($currentStudent, \@{$lectPrefs{$currentLecturer}}, 
								\@{$lectAssignments{$currentLecturer}});				
				if($updates){			
					print "Lecturer $currentLecturer is overloaded. Removing $worst.\n";
				}
				
				breakAssociation($worst, \@{$lectAssignments{$currentLecturer}}, 
								\@{$projAssignments{$studAssignments{$worst}}}, 
								\%studAssignments,
								\@unassignedStudents);							
			}			
			# Check to see if project is full
			if( (scalar @{$projAssignments{$currentProject}}) == $projCap{$currentProject}){

				$worst = findWorst($currentStudent, \@{$projectedPrefs{$currentProject}}, 
								\@{$projAssignments{$currentProject}});				

				if($updates){
					print "Project $currentProject is full: removing successors to $worst.\n";
				}
				
				# Remove all successors to worst student from lecturer preferences
				deleteSuccessorPrefs($worst, $currentProject, \@{$projectedPrefs{$currentProject}}, \%studPrefs);

			}
			# Check to see if lecturer is full
			if( (scalar @{$lectAssignments{$currentLecturer}}) == $lectCap{$currentLecturer}){
				
				$worst = findWorst($currentStudent, \@{$lectPrefs{$currentLecturer}}, 
								\@{$lectAssignments{$currentLecturer}});				

				if($updates){
					print "Lecturer $currentLecturer is full: removing successors to $worst.\n";
				}
				
				
				deleteSuccessorPrefsAll($worst, \@{$lectPrefs{$currentLecturer}}, 
										\%projectedPrefs, \@{$lectProj{$currentLecturer}},\%studPrefs);				
			}

			if($updates){
				print "$iters: Remaining students: @unassignedStudents\n----\n";
			}

			#print Dumper(\%studPrefs);

			#####
		}else{ # All unallocated students have empty project lists
			$done = 1; 	
		}
	}else{ # No students are unallocated
		$done = 1;
	}
}
# END ALGORITHM


######################
# Distribute unassigned
# This will put students who are unassigned in the first available project

if($distributeUnassigned){
	print "***Distributing remaining students.\n" if($updates);
	my @unassignedCopy = @unassignedStudents;
	foreach my $student (@unassignedCopy){
		my @freeProj = freeProjects(\%projAssignments, \%projCap, \%lectAssignments, \%lectCap, \%lectProj);
		if( scalar @freeProj ){
			# Assign to random free project
			my $project = $freeProj[rand @freeProj];
			my $lecturer = $projLect{$project};
			
			print "Assigning student $student to project $project of lecturer $lecturer.\n" if($updates);
			
			# Assign student to the project
			push(@{$projAssignments{$project}}, $student);
			push(@{$lectAssignments{$lecturer}}, $student);
			$studAssignments{ $student } = $project;
			
			# remove from unassigned students
			$idx = firstidx { $_ eq $student } @unassignedStudents;
			splice(@unassignedStudents, $idx, 1);

		}else{
			last;
		}
	}
}

###################### 
# Output


# output student assignments to file
open ( OUTPUT, ">", $outStudentsFN ) or die("Could not open output file $outStudentsFN : $!");
print OUTPUT "UNASSIGNED: @unassignedStudents\n";
while (($key, $value) = each(%studAssignments)){
	# Output student, project, and the preference
	my $idx = firstidx { $_ eq "$value" } @{$origStudPrefs{$key}};
	print OUTPUT $key." ".$value." " . ($idx +1)."\n";
}
close OUTPUT;


# output lecturer assignments to file
my @underCapacity;
while (($key, $value) = each(%lectPrefs)){
	if( (scalar @{$lectAssignments{$key}}) < $lectCap{$key}){
		push(@underCapacity, "$key (".( $lectCap{$key} - (scalar @{$lectAssignments{$key}}) )." spots)");
	}
}

open ( OUTPUT, ">", $outLecturersFN ) or die("Could not open output file $outLecturersFN : $!");
print OUTPUT "UNDERCAPACITY: @underCapacity\n";
while (($key, $value) = each(%lectAssignments)){
	print OUTPUT "$key @{$value}\n";
}
close OUTPUT;

# output project assignments to file
splice(@underCapacity,0);
while ((my $project, my $value) = each(%projLect)){
	if( (scalar @{$projAssignments{$project}}) < $projCap{$project}){
		push(@underCapacity, "$project (".( $projCap{$project} - (scalar @{$projAssignments{$project}}) )." spots)");
	}
}

open ( OUTPUT, ">", $outProjectsFN ) or die("Could not open output file $outProjectsFN : $!");
print OUTPUT "UNDERCAPACITY: @underCapacity\n";
while (($key, $value) = each(%projAssignments)){
	print OUTPUT "$key @{$value}\n";
}
close OUTPUT;


#print Dumper(\%lectProj);

print("Done allocating students. Number of unallocated students: ".(scalar @unassignedStudents)."\n\n");



