export const enLocalResource = {
  translation: {
    // Interface elements
    "ui.developed_by": "Developed by Alexander Kachkaev",
    "ui.l_app_title_1": "Graph",
    "ui.l_app_title_2": "plotter",
    "ui.l_app_version": "version ",
    "ui.h_info": "About this app",
    "ui.h_boundaries": "Plot area properties",
    "ui.h_charts": "My charts",
    "ui.h_color": "Choose color",

    "ui.l_info_1":
      "Graph plotter allows you to plot up to 10 function graphs at once.",
    "ui.l_info_2": "If find this app useful, invite your friends!",
    "ui.l_translator": "Translated by ",
    "ui.l_ymax": "ymax",
    "ui.l_ymin": "ymin",
    "ui.l_xmax": "xmax",
    "ui.l_xmin": "xmin",
    "ui.l_n_of_points": "Number of dots",
    "ui.l_y_equals": "y =",
    "ui.l_saving": "Saving your information…",
    "ui.l_error_load":
      "An error occurred when loading your graphs. It is recommended to reload current page. Please, notice that no changes that you will make before reloading will can be saved. Sorry for any inconvenience.",
    "ui.l_error_save":
      "An error occurred when saving your graphs. It is recommended to reload current page. Please, notice that no changes that you will make before reloading will can be saved. Sorry for any inconvenience.",
    "ui.l_autonomous_mode": "Autonomous mode",

    "ui.b_plot": "Plot!",
    "ui.b_stop": "Stop",
    "ui.b_del": "Delete",
    "ui.b_help": "Help",
    "ui.b_extra": "Take part in a cool research!",
    "ui.b_group": "Application group",
    "ui.b_report_an_error": "Report an error",
    "ui.b_add_graph": "Add one more function",
    "ui.b_add_app": "Add application to my page",
    "ui.b_add_friends": "Invite friends!",
    "ui.b_apply": "Apply",
    "ui.b_random_color": "Random color",
    "ui.b_defaults": "Restore defaults",
    "ui.b_ok": "OK",
    "ui.b_cancel": "Cancel",
    "ui.b_yes": "Yes",
    "ui.b_no": "No",
    "ui.b_add": "Add",

    "ui.c_show_grid": "Show grid",
    "ui.c_show_axes": "Show axes",

    "ui.cap_f_empty": "Input a function in the field below to see its graph.",
    "ui.cap_f_param_error": "Error in plot area properties",
    "ui.cap_f_error": "Error in function",

    // Errors in formula

    //// Common errors
    "error.formula.0": "Unknown error occurred.",
    "error.formula.1": "Expression is empty.",
    "error.formula.2": "Expression is too long.",
    "error.formula.3": "Symbol <0>{2}</0> can not be used.",

    //// Equals sign
    "error.formula.10": "The expression must contain the equals sign.",
    "error.formula.11":
      "The expression can not contain more than one equals sign.",
    "error.formula.12":
      "Equals sign cannot be placed in the very beginning of the expression.",
    "error.formula.13":
      "Equals sign cannot be placed in the very end of the expression.",
    "error.formula.14":
      "Equals sign cannot be inside of brackets (there are {2} unpaired left brackets before it).",

    //// Brackets
    "error.formula.20":
      "Extra right bracket found. The number of right brackets must not be more than the number of left brackets before it.",
    "error.formula.21":
      "The number of left brackets is more than the number of right brackets (by {2}).",
    "error.formula.22":
      "Left bracket cannot follow the right bracket (arithmetical sign needed between them).",
    "error.formula.23":
      "Empty brackets are allowed only when calling a function without any parameters.",

    //// Wrong elements / element placement
    "error.formula.30": "Couldn't parse <0>{2}</0>.",
    "error.formula.31": "Unknown argument or constant <0>{2}</0>.",
    "error.formula.32": "<0>{2}</0> — wrong numeric format.",
    "error.formula.33":
      "Comma can be used only between arguments for a function.",
    "error.formula.34": "Function <0>{2}</0> is unknown.",
    "error.formula.35": "Argument <0>{2}</0> cannot be used as a function.",
    "error.formula.36": "Constant <0>{2}</0> cannot be used as a function.",
    "error.formula.37":
      "The name of the function <0>{2}</0> must be followed by brackets.",
    "error.formula.38": "Arithmetical sign expected.",
    "error.formula.39": "<0>{2}</0> — this number is too big.",

    //// Sign misplacement
    "error.formula.40": "Sign <0>{2}</0> cannot be placed here.",
    "error.formula.41":
      "Sign <0>{2}</0> cannot be placed to the very end of an expression.",
    "error.formula.42":
      "Sign <0>{2}</0> cannot be placed to the very beginning of an expression.",
    "error.formula.43":
      "Sign <0>{2}</0> cannot be placed before the right bracket.",
    "error.formula.44":
      "Sign <0>{2}</0> cannot be placed after the left bracket.",
    "error.formula.45": "Sign <0>{2}</0> cannot be placed before the comma.",
    "error.formula.46": "Sign <0>{2}</0> cannot be placed after the comma.",
    "error.formula.47":
      "Sign <0>{2}</0> cannot follow any other arithmetical signs.",

    //// Arguments of a function
    "error.formula.50": "Wrong number of parameters for <0>{2}</0> function.",
    "error.formula.51":
      "Function <0>{2}</0> has too many arguments. The number of arguments must vary from {3} to {4}.",
    "error.formula.52":
      "Function <0>{2}</0> has too many arguments. The number of arguments must be equal to {3}.",
    "error.formula.53": "Function <0>{2}</0> does not accept any arguments.",
    "error.formula.54":
      "Function <0>{2}</0> has too few arguments. The number of arguments must be more than {3}.",
    "error.formula.55":
      "Function <0>{2}</0> has too few arguments. The number of arguments must vary from {3} to {4}.",
    "error.formula.56":
      "Function <0>{2}</0> has too few arguments. The number of arguments must be equal to {3}.",
    "error.formula.57":
      "An argument for the <0>{2}</0> function expected between the bracket and the comma.",
    "error.formula.58":
      "An argument for function <0>{2}</0> expected after the comma.",

    //// Different errors for functions
    "error.wrong_bound":
      "Field <0>{0}</0> must contain a number from <1>-{1} to {1}.</1>",
    "error.wrong_number_of_dots":
      "The field with number of dots must contain an integer number in range between {0} and {1}.",
    "error.small_range":
      "<0>{1}</0> must be greater than <0>{0}</0> and their minimum difference must be equal to {2}.",
    "error.y_in_f":
      "You cannot use <0>y</0> as an argument for the function. Only <0>x</0> may be used.",
    "error.x_rus": " Hint: to designate ex, use latin letter <0>x</0>.",
    "error.vertical_slash":
      " Hint: to plot an absolute value function use <0>abs</0>, e. g. abs(x).",
    "error.comma":
      " Hint: to split the integer and the fractional part of a number use a dot, e.g. 3.14.",
    "error.log_ln":
      " Hint: In this version natural logarithm is designate as <0>ln</0>.",
    "error.equal_presents": "Second equals sign <0>=</0> cannot appear twice.",
    "error.func_name_hint": " Hint: To plot {0}, use function <0>{1}</0>.",
  },
};
