list_free_projects <- function( env ){
  sapply( names( env$project_list ), function( project ){
    
    project_cap <- env$project_list[[ project ]][[ "cap" ]]
    lecturer <- env$project_list[[ project ]][[ "lecturer" ]]
    lecturer_cap <- env$lecturer_list[[ lecturer ]][[ "cap" ]]
    
    n_students_in_project <- length(env$project_assignments[[ project ]])
    n_students_in_lecturer <- length(env$lecturer_assignments[[ lecturer ]])
    
    if(n_students_in_lecturer >= lecturer_cap )
      return(FALSE)
    
    if(n_students_in_project >= project_cap )
      return(FALSE)
    
    return(TRUE)
    
  } )
}