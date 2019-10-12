# Support library for student allocation problem 
# Richard D. Morey, 18 March 2013

# Abraham, D.J., Irving, R.W. and Manlove, D.M. (2007)        
# Two algorithms for the student-project allocation problem.   
# Journal of Discrete Algorithms, 5  (1).   pp. 73-90.         
# http://dx.doi.org/10.1016/j.jda.2006.03.006              

package studentAllocation;

use Exporter 'import';
our $VERSION = '0.01';
our @EXPORT  = qw(breakAssociation deleteSuccessorPrefs deleteSuccessorPrefsAll findWorst freeProjects);

use List::MoreUtils qw(firstidx);

sub breakAssociation {
	
	my $student;
	my $project;
	my $ref_lectAssignments;
	my $ref_projAssignments;
	my $ref_studAssignments;
	my $ref_unassigned;
	
	($student, $ref_lectAssignments, $ref_projAssignments, $ref_studAssignments, $ref_unassigned) = @_;
							
	# break assignment of student to project
	# remove student from lecturer assignment
	$idx = firstidx { $_ eq $student } @{$ref_lectAssignments};
	splice(@{$ref_lectAssignments},$idx,1);
								
	#remove student from project assignment
	$idx = firstidx { $_ eq $student } @{$ref_projAssignments};
	splice(@{$ref_projAssignments},$idx,1);

	#make student unassigned
	push(@{$ref_unassigned}, $student);
	delete ${$ref_studAssignments}{$student};

}

sub deleteSuccessorPrefs {
	
	my $student;
	my $ref_projectedPrefs;
	my $ref_studPrefs;
	my $idx;
		
	($student, $project, $ref_projectedPrefs, $ref_studPrefs) = @_;

	$idx = firstidx { $_ eq $student } @{$ref_projectedPrefs};
		
	# if it is not in the list, or is the last element, return (no successors)
	return if( ($idx == -1) or ($idx == (scalar @{$ref_projectedPrefs} - 1)));
	
	# else, we have successors, so delete them
	@_ = splice(@{$ref_projectedPrefs}, $idx + 1);
	
	foreach $value (@_){
		do{
			$idx = firstidx { $_ eq $project } @{${$ref_studPrefs}{$value}};	
			splice(@{${$ref_studPrefs}{$value}}, $idx, 1) if($idx > -1);
		} until($idx==-1);
	}
}

sub deleteSuccessorPrefsAll {
	
	my $student;
	my $ref_lectPrefs;
	my $ref_projectedPrefs;
	my $ref_studPrefs;
	my $ref_lectProj;
	my $idx;
		
	($student, $ref_lectPrefs, $ref_projectedPrefs, $ref_lectProj, $ref_studPrefs) = @_;

	$idx = firstidx { $_ eq $student } @{$ref_lectPrefs};
		
	# if it is not in the list, or is the last element, return (no successors)
	return if( ($idx == -1) or ($idx == ( (scalar @{$ref_lectPrefs}) - 1)));
	
	
	# else, we have successors, so delete them
	@_ = splice(@{$ref_lectPrefs}, $idx + 1);
			
	foreach $value (@_){
		foreach $project (@{$ref_lectProj}){
			do{
				$idx = firstidx { $_ eq $value } @{${$ref_projectedPrefs}{$project}};
				splice(@{${$ref_projectedPrefs}{$project}}, $idx, 1) if($idx > -1);
			} until($idx==-1);
			do{
				$idx = firstidx { $_ eq $project } @{${$ref_studPrefs}{$value}};	
				splice(@{${$ref_studPrefs}{$value}}, $idx, 1) if($idx > -1);
			} until($idx==-1);
		}
	}	
	
}


sub findWorst {

	my $justAdded;
	my $ref_prefList;
	my $ref_studentList;
	my @studentList;
	my @prefList;
	my $idx;
	my $maxIdx = -1;
	my $worst;
	
	($justAdded, $ref_prefList, $ref_studentList) = @_;
	
	@studentList = @{$ref_studentList};
	@prefList    = @{$ref_prefList};
	
	my $prefLength = scalar @preflist;
	
	#return($justAdded) if( (firstidx { $_ eq $justAdded } @prefList) == -1 );
	
	# Find worst student in project
	foreach $value (@studentList){
		$idx = firstidx { $_ eq $value } @prefList;
		
		if( $idx == -1 ){
			$maxIdx = $idx;
			$worst = $value;
			last;
		}
		if($idx>$maxIdx){
			$maxIdx = $idx;
			$worst = $value;
		}
	}

	return($worst);	
	
}

sub freeProjects {

	my $ref_projAssignments;
	my $ref_projCap;
	my $ref_lectAssignments;
	my $ref_lectCap;
	my $ref_lectProj;
	
	($ref_projAssignments, $ref_projCap, $ref_lectAssignments, $ref_lectCap, $ref_lectProj) = @_;
	
	my @freeProj;
	
	foreach $lecturer (keys(%{$ref_lectCap})){
		if( (scalar @{${$ref_lectAssignments}{$lecturer}}) < ${$ref_lectCap}{$lecturer}){
			foreach $project (@{${$ref_lectProj}{$lecturer}}){
				if( (scalar @{${$ref_projAssignments}{$project}}) < ${$ref_projCap}{$project}){
					push(@freeProj, $project);
				}
			}
		}
	}	
	
	return @freeProj;
	
}
