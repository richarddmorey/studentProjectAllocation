library(shiny)
library(shinydashboard)
library(shinyjs)
library(shinycssloaders)

vals <- reactiveValues(lect_list = NULL,
                       proj_list = NULL,
                       stud_list = NULL,
                       total_effective_cap = NULL,
                       total_students = NULL,
                       algo_ready = FALSE,
                       log = NULL, 
                       output_file = NULL)

create_output_file <- function(allocation_output, lect_file, proj_file, stud_file, stud_list, delim){
  
  # set up output directory
  td = tempdir(check = TRUE)
  save_dir = tempfile(pattern = "allocation_", tmpdir = td)
  if(dir.exists(save_dir))
    unlink(save_dir, recursive = TRUE)
  dir.create(
    file.path(save_dir, "original_files"),
    recursive = TRUE
    )
  
  lecturer_allocation_fn = file.path(save_dir, "lecturer_allocation.csv")
  rio::export(
    x = studentAllocation::neat_lecturer_output(allocation_output, delim = delim),
    file = lecturer_allocation_fn
  )

  project_allocation_fn = file.path(save_dir, "project_allocation.csv")
  rio::export(
    x = studentAllocation::neat_project_output(allocation_output, delim = delim),
    file = project_allocation_fn
  )

  student_allocation_fn = file.path(save_dir, "student_allocation.csv")
  rio::export(
    x = studentAllocation::neat_student_output(allocation_output, stud_list),
    file = student_allocation_fn
  )
  
  if(length(allocation_output$unallocated)){
    unallocated_students_fn = file.path(save_dir, "unallocated_students.txt")
    cat(file = unallocated_students_fn, sep = "\n",
        allocation_output$unallocated
    )
  }
  
  ## Copy original files over
  original_file_paths = c( lect_file$datapath, 
                           proj_file$datapath,
                           stud_file$datapath )
  file.copy(original_file_paths, 
            file.path(save_dir, "original_files", 
                      c(lect_file$name,
                        proj_file$name,
                        stud_file$name))
            )
  
  # zip up contents
  zip_file = tempfile(tmpdir = td, pattern = "allocation_", fileext = ".zip")
  zip::zipr(zipfile = zip_file, files = save_dir)
  
  # Clean up folder
  if(dir.exists(save_dir))
    unlink(save_dir, recursive = TRUE)
  
  return( zip_file )

}


# Define UI for data upload app ----
ui <- dashboardPage(
  dashboardHeader(title = "Project allocation",
                  tags$li(a(href = 'https://github.com/richarddmorey/studentProjectAllocation',
                            target = "_blank",
                            icon("github"),
                            title = "GitHub repository for this app"),
                          class = "dropdown")),

  # Sidebar layout with input and output definitions ----
  dashboardSidebar(
    checkboxInput("opt_randomize", "Randomize before", FALSE),
    checkboxInput("opt_distribute", "Distribute unallocated", TRUE),
    textInput("neat_delim", "Output delimiter", studentAllocation::pkg_options()$neat_delim, width = "5em" ),
    numericInput("opt_max_time", "Time limit (s)", 15, min = 1, max = 60, step = 1),
    numericInput("opt_max_iters", "Iteration limit", 0, min = 0, step = 25)
  ),
    # Main panel for displaying outputs ----
  dashboardBody(
    useShinyjs(),
    tabBox( width = 12,
      tabPanel(HTML("Introduction &#9654;"), htmlOutput("intro")),
      tabPanel(uiOutput("lecturers_tab_label"),
               fileInput("lect_file", "Choose lecturers file",
                         multiple = FALSE,
                         accept = "text/plain"),
               verbatimTextOutput("lect_check"),
               htmlOutput("lecturer_help"),
      ),
      tabPanel(uiOutput("projects_tab_label"),
               fileInput("proj_file", "Choose projects file",
                         multiple = FALSE,
                         accept = "text/plain"),
               verbatimTextOutput("proj_check"),
               htmlOutput("projects_help"),
      ),
      tabPanel(uiOutput("students_tab_label"),
               fileInput("stud_file", "Choose students file",
                         multiple = FALSE,
                         accept = "text/plain"),
               verbatimTextOutput("stud_check"),
               htmlOutput("students_help"),
      ),
      tabPanel(uiOutput("allocation_tab_label"), 
               withSpinner(htmlOutput("algo_output")),
               p(),
               hidden(
                 div(
                   id = "download_all_div",
                   downloadLink('download_output', HTML('&#11088; Download allocation output&#10549;')),
                   br(), br(),
                   actionButton("rerun_allocation", HTML("&#10227; Re-run allocation")),
                   hr(),
                   actionButton("toggle_log", "Show/hide log"),
                   hidden(
                     div( id = "log_div",
                          verbatimTextOutput("log_text"),
                          tags$head(tags$style("#log_text{ 
overflow-y:scroll; background: ghostwhite; max-height: 30em;}"))
                     )
                   )
                   )
               ),
      ),
      tabPanel(HTML("&#9432; Options help"), htmlOutput("options_help"))
    )
  )
)

# Define server logic to read selected file ----
server <- function(input, output, session) {
  
  addClass(selector = "body", class = "sidebar-collapse")
  
  output$allocation_tab_label <- renderUI({
    if(vals$algo_ready){
      return(HTML("&#128994; Allocation"))
    }else{
      return(HTML("&#10060; Allocation"))
    }
  })
  
  output$lecturers_tab_label <- renderUI({
    if(is.list(vals$lect_list)){
      return(HTML("&#9989; Lecturers &#9654;"))
    }else{
      return(HTML("&#8193; Lecturers &#8193;"))
    }
  })
  
  output$projects_tab_label <- renderUI({
    if(is.list(vals$proj_list)){
      return(HTML("&#9989; Projects &#9654;"))
    }else{
      return(HTML("&#8193; Projects &#8193;"))
    }
  })
  
  output$students_tab_label <- renderUI({
    if(is.list(vals$stud_list)){
      return(HTML("&#9989; Students &#9654;"))
    }else{
      return(HTML("&#8193; Students &#8193;"))
    }
  })
  
  observeEvent(input$toggle_log,{
    shinyjs::toggle("log_div")
  })
  
  observeEvent(vals$log,{
    if(is.null(vals$log))
      shinyjs::hide("log_div")
  })
  
  output$download_output <- downloadHandler(
    filename = function() {
       paste('allocation-', Sys.Date(), '.zip', sep='')
      },
    content = function(con) {
      fn = vals$output_file
      if(!is.null(fn)){
        if(file.exists(fn)){
          if(file.size(fn)>0){
            file.copy(fn, con)
          }
        } 
      }else{
        return(NULL)
      }
    }
  )
  
  output$intro <- renderUI({
    x <- paste0(readLines("include/html/intro.html"))
    return(HTML(x))
  })

  output$lecturer_help <- renderUI({
    x <- paste0(readLines("include/html/lecturers.html"))
    return(HTML(x))
  })
  
  output$students_help <- renderUI({
    x <- paste0(readLines("include/html/students.html"))
    return(HTML(x))
  })
  
  output$projects_help <- renderUI({
    x <- paste0(readLines("include/html/projects.html"))
    return(HTML(x))
  })
  
  output$options_help <- renderUI({
    x <- paste0(readLines("include/html/options.html"))
    return(HTML(x))
  })
  
  output$lect_check <- renderText({
    
    req(input$lect_file)
    
    tryCatch(
      {
        lect_list <- studentAllocation::read_lecturer_file(input$lect_file$datapath)
      },
      error = function(e) {
        vals$algo_ready = FALSE
        vals$log = NULL
        vals$lect_list = NULL
        # return a safeError if a parsing error occurs
        stop(safeError(e))
      }
    )
    
    vals$lect_list = lect_list

    if( is.list(vals$lect_list) &
        is.list(vals$proj_list) &
        is.list(vals$stud_list)
    ) vals$algo_ready = TRUE
    
    return(
      paste( length(lect_list), "lecturer preferences loaded.")
    )
  })
  
  output$proj_check <- renderText({
    
    req(input$proj_file)
    
    tryCatch(
      {
        proj_list <- studentAllocation::read_project_file(input$proj_file$datapath)
      },
      error = function(e) {
        vals$algo_ready = FALSE
        vals$log = NULL
        vals$proj_list = NULL
        # return a safeError if a parsing error occurs
        stop(safeError(e))
      }
    )
    
    vals$proj_list = proj_list
    
    if( is.list(vals$lect_list) &
        is.list(vals$proj_list) &
        is.list(vals$stud_list)
    ) vals$algo_ready = TRUE
    
    return(
      paste( length(proj_list), "project definitions loaded.")
    )
  })

  output$stud_check <- renderText({
    
    req(input$stud_file)
    
    tryCatch(
      {
        stud_list <- studentAllocation::read_student_file(input$stud_file$datapath)
      },
      error = function(e) {
        vals$algo_ready = FALSE
        vals$log = NULL
        vals$stud_list = NULL
        # return a safeError if a parsing error occurs
        stop(safeError(e))
      }
    )
    
    vals$stud_list = stud_list  
    vals$total_students = length(stud_list)
    
    if( is.list(vals$lect_list) &
        is.list(vals$proj_list) &
        is.list(vals$stud_list)
        ) vals$algo_ready = TRUE
    
    return(
      paste( length(stud_list), "student preferences loaded.")
    )
  })
  
  output$algo_output <- renderUI({
    

    validate(need(vals$algo_ready, "Upload the required files under the tabs to the left."))
    
    val_input = try(
      studentAllocation::check_input_lists(vals$student_list, vals$lecturer_list, vals$project_list ),
      silent = TRUE
      )
    validate(need(!inherits(val_input, "try-error"), val_input))
    
    studentAllocation::pkg_options(print_log = TRUE)
    
    shinyjs::hide("download_all_div")
    
    # Add dependency on re-run button
    input$rerun_allocation
    
    ctx = V8::v8()
    
    start_time = Sys.time()
    
    tryCatch(
      {
        algo_output <- studentAllocation::spa_student(
          vals$stud_list,
          vals$lect_list,
          vals$proj_list,
          randomize = isolate(input$opt_randomize),
          distribute_unallocated = isolate(input$opt_distribute),
          time_limit = isolate(input$opt_max_time),
          iteration_limit = ifelse(isolate(input$opt_max_iters) < 1,
                                   Inf,
                                   isolate(input$opt_max_iters)),
          ctx = ctx
          )
      },
      error = function(e) {
        x = try(ctx$get("s.log"), silent = TRUE)
        if(!inherits(x, "try-error")){
          vals$log = x$message
        }
        # return a safeError if a parsing error occurs
        stop(safeError(e))
      }
    )
    
    end_time = Sys.time()
    
    vals$algo_done = TRUE
    vals$total_effective_cap = sum(studentAllocation::effective_capacity(vals$lect_list, vals$proj_list))

    vals$output_file = create_output_file( 
      allocation_output = algo_output,
      lect_file = input$lect_file,
      proj_file = input$proj_file,
      stud_file = input$stud_file,
      stud_list = vals$stud_list,
      delim = input$neat_delim
    )
                                  
    shinyjs::show("download_all_div")
    vals$log = algo_output$log$message
    
    summary_string = paste0("<p> Performed ", algo_output$iterations,
          " iterations in ", round(as.numeric(end_time - start_time), 3), " seconds. ",
          " There are ", length(algo_output$unallocated), " unallocated students. ")
    
    if(input$opt_distribute){
      summary_string = paste0(
        summary_string,
        length(algo_output$unallocated_after_SPA), 
        " students (",
        round(100 * (length(algo_output$unallocated_after_SPA) - length(algo_output$unallocated)) / length(vals$stud_list))
        ,"%) ",
        " were assigned random projects."
      )
    }
    
    if(vals$total_effective_cap < vals$total_students){
      summary_string = paste0(
        summary_string,
        "<p> &#128308; There were ", vals$total_students, 
        " total students but the total effective capacity of lecturers ",
        "(taking into account capacity of projects as well) was only ",
        vals$total_effective_cap, " spaces. "
      )
    }

    return(HTML(summary_string))
    
  })

  output$log_text <- renderText({
    req(vals$log)
    l = length(vals$log)
    digits = ceiling(log10(l))
    fmt = paste0("%0",digits,"d")
    lineno = sprintf(fmt, 1:l)
    paste(paste(lineno, "    ", vals$log), collapse = "\n")
  })
    
}


# Create Shiny app ----
shinyApp(ui, server)
