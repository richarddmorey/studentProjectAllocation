#' Run the SPA student algorithm of Abraham et al (2007)
#'
#' @param student_list A list of student preferences, in the format output by `read_student_file`
#' @param lecturer_list A list of lecturer preferences, in the format output by `read_lecturer_file`
#' @param project_list A list of project definitions, in the format output by `read_project_file`
#' @param randomize Randomize student order before starting the algorithm?
#' @param iteration_limit Iteration limit on the algorithm
#' @param time_limit Time limit in seconds on the algorithm
#' @param distribute_unallocated Randomly distribute unallocated students at the end?
#' @param favor_student_prefs Favor student preferences? Do not set this to TRUE
#'
#' @return
#' @export
#'
#' @examples
spa_student <- function( student_list, lecturer_list, project_list,
                         randomize = pkg_options()$randomize,
                         iteration_limit = pkg_options()$iteration_limit,
                         time_limit = pkg_options()$time_limit,
                         distribute_unallocated = pkg_options()$distribute_unallocated,
                         favor_student_prefs = pkg_options()$favor_student_prefs){
  
  e <- new.env()
  e$student_list <- student_list
  e$lecturer_list <- lecturer_list
  e$project_list <- project_list
  e$lecturer_projects <- lecturer_projects( project_list )

  stopifnot(
    check_input_lists( e$student_list, e$lecturer_list, e$project_list )
  )
  
  if(randomize){
    randomize_names <- sample( names(e$student_list) )
    student_list <- lapply(randomize_names, function(n){
      e$student_list[[ n ]]
    })
    names( student_list ) <- randomize_names
  }
  
  pp <- projected_preference_list( student_list, lecturer_list, project_list )

  e$lecturer_list <- pp[[ "lecturer_list" ]]
  e$projected_preferences <- pp[[ "projected_preferences" ]]
  rm(pp)
  
  e$unallocated_students <- names( e$student_list )
  
  done <- FALSE
  iterations_done <- 0
  start_time <- Sys.time()
  
  e$project_assignments <- list()
  e$lecturer_assignments <- list()
  e$student_assignments <- list()
  e$full_projects <- list()
  e$full_lecturers <- list()
  
  while( !done ){ ## Core of algorithm
    time_since_start <- Sys.time() - start_time
    
    if( length( e$unallocated_students ) == 0 ) 
      done <- TRUE
    
    if( done ) 
      break
    
    if( iterations_done > iteration_limit )
      stop("Iteration limit of ", iteration_limit ," exceeded.")
      
    if( time_since_start > time_limit )
      stop("Time limit of ", time_limit ," seconds exceeded.")
    
    
    
    ## find an student with a project left in their list
    for( student in e$unallocated_students ){
      n_projects <- length(e$student_list[[ student ]])
      if( n_projects > 0 ) break
    }
    
    if( n_projects > 0){
      
      project <- e$student_list[[ student ]][1]
      project_cap <- e$project_list[[ project ]][[ "cap" ]]
      lecturer <- e$project_list[[ project ]][[ "lecturer" ]]
      lecturer_cap <- e$lecturer_list[[ lecturer ]][[ "cap" ]]
      
      assign_student( student, project, lecturer, e)
      allocate_log(iterations_done," Assigned ", student," to project ", project, " of ", lecturer,".")

      ## check to see if project is overloaded
      if( length( e$project_assignments[[ project ]] ) > project_cap ){
        worst_student <- find_worst_for_project( project, e, favor_student_prefs )
        break_assignment( worst_student, project, lecturer, e)
        
        allocate_log(iterations_done," Project ", project, " overloaded. Removing ", worst_student, ".")
        
      }
      
      ## check to see if lecturer is overloaded
      if( length( e$lecturer_assignments[[ lecturer ]] ) > lecturer_cap ){
        worst_student <- find_worst_for_lecturer( lecturer, e, favor_student_prefs )
        break_assignment( worst_student, project, lecturer, e)
        allocate_log(iterations_done," Lecturer ", lecturer, " overloaded. Removing ", worst_student, ".")
      }
      
      ## check to see if project is full
      if( length( e$project_assignments[[ project ]] ) == project_cap ){
        worst_student <- find_worst_for_project( project, e, favor_student_prefs )
        delete_successor_prefs( worst_student, project, e )
        e$full_projects <- unique(c(e$full_projects, project))
        allocate_log(iterations_done," Project ", project, " at capacity. Removing successors to ", worst_student, ".")
      }
      
      ## check to see if lecturer is full
      if( length( e$lecturer_assignments[[ lecturer ]] ) == lecturer_cap ){
        worst_student <- find_worst_for_lecturer( lecturer, e, favor_student_prefs)
        delete_successor_prefs_all( worst_student, lecturer, e)
        e$full_lecturers <- unique(c(e$full_lecturers, lecturer))
        allocate_log(iterations_done," Lecturer ", lecturer, " at capacity. Removing successors to ", worst_student, ".")
      }
      
    }else{ # all unallocated students have empty preference lists
      done <- TRUE
    }
    
  
    iterations_done <- iterations_done + 1
    
  } ## Done with core of algorithm
  
  ## Distribute unassigned
  
  unallocated_after_spa <- e$unallocated_students
  
  allocate_log(iterations_done," Remaining students: ", paste(unallocated_after_spa, collapse = " "), ".")
  
  if( distribute_unallocated ){
    
    allocate_log(" ***Distributing remaining students.***")
    
    for( student in unallocated_after_spa ){
      project <- random_free_project( e )
      
      if( is.null(project) ) break # No free projects
      
      lecturer <- e$project_list[[ project ]][[ "lecturer" ]]
      project_cap <- e$project_list[[ project ]][[ "cap" ]]
      lecturer_cap <- e$lecturer_list[[ lecturer ]][[ "cap" ]]
      
      assign_student( student, project, lecturer, e)
      allocate_log(iterations_done," Assigned ", student," to project ", project, " of ", lecturer,".")
      
      ## check to see if project is full
      if( length( e$project_assignments[[ project ]] ) == project_cap ){
        e$full_projects <- unique(c(e$full_projects, project))
        allocate_log("Project ", project, " is now at capacity.")
      }
      
      ## check to see if lecturer is full
      if( length( e$lecturer_assignments[[ lecturer ]] ) == lecturer_cap ){
        e$full_lecturers <- unique(c(e$full_lecturers, lecturer))
        allocate_log("Lecturer ", lecturer, " is now at capacity.")
      }
      
      
    }
  }
  
  e$iterations = iterations_done
  e$time = Sys.time() - start_time
  e$unallocated_after_spa <- unallocated_after_spa
  return( e )
  
}


