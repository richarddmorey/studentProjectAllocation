

find_worst_for_lecturer <- function(lecturer, env, favor_student_prefs = TRUE){
  
  assignments <- env$lecturer_assignments[[ lecturer ]]
  
  if(favor_student_prefs){
    idxs <- sapply(assignments, function( student ){
      p <- e$student_assignments[[ student ]]
      match( p, env$student_list[[ student ]],  nomatch = .Machine$integer.max )
    })
  }else{
    preference_list <- env$lecturer_list[[ lecturer ]][[ "students" ]]
    idxs <- match( assignments, preference_list, nomatch = .Machine$integer.max )
  }
  
  to_eliminate <- which.max( idxs )
  return( assignments[ to_eliminate ] )
}

find_worst_for_project <- function(project, env, favor_student_prefs = TRUE){
  
  assignments <- env$project_assignments[[ project ]]
  
  if(favor_student_prefs){
    idxs <- sapply(assignments, function( student ){
      p <- e$student_assignments[[ student ]]
      match( p, env$student_list[[ student ]],  nomatch = .Machine$integer.max )
    })
  }else{
    preference_list <- env$projected_preferences[[ project ]]
    idxs <- match( assignments, preference_list, nomatch = .Machine$integer.max )
    to_eliminate <- which.max( idxs )
  }
  
  to_eliminate <- which.max( idxs )
  
  return( assignments[ to_eliminate ] )
}
