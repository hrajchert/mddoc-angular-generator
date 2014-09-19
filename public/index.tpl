<!doctype html>
<html ng-app="main">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link href="css/main.css" rel="stylesheet">
        <link href="css/theme.css" rel="stylesheet">

        <% if @mddoc.settings.styles: %>
            <% for style in @mddoc.settings.styles: %>
                <link href="<%- style %>" rel="stylesheet">
            <% end %>
        <% end %>

    </head>
    <body>

    <!-- Fixed navbar -->
    <div ng-controller="HeaderCtrl" class="navbar navbar-default navbar-fixed-top" role="navigation">
        <div class="container">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <a class="navbar-brand" href="#"><%- @mddoc.settings.title %></a>
            </div>
            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <% for menuItem in @mddoc.settings.menu: %>
                        <% if menuItem.menu?: %>
                            <li ng-class="{ active: isChild('<%- menuItem.link %>')}" dropdown >
                                <a href="#" class="dropdown-toggle"><%- menuItem.name %> <span class="caret"></span></a>
                                <ul class="dropdown-menu" role="menu">
                                    <% for submenu in menuItem.menu: %>
                                        <li ng-class="{ active: is('<%- submenu.link %>')}">
                                            <a href="#<%- submenu.link %>"><%- submenu.name %></a>
                                        </li>
                                    <% end %>
                                </ul>
                            </li>
                        <% else: %>
                            <li ng-class="{ active: is('<%- menuItem.link %>')}">
                                <a href="#<%- menuItem.link %>"><%- menuItem.name %></a>
                            </li>
                        <% end %>


                    <% end %>
                </ul>
            </div><!--/.nav-collapse -->
        </div>
    </div>
    <div class="container">
        <div class="content" >
            <div ng-view></div>
        </div>
    </div>
    <div class="footer">
        <div class="container">
            <p class="text-muted">Documentation created using <a href="https://github.com/hrajchert/mddoc">mddoc</a> with the <a href="https://github.com/hrajchert/mddoc-angular-generator">angular generator</a>.</p>
        </div>
    </div>
        <script src="js/vendor/angular-generator-lib.js"></script>
        <script src="js/main.js"></script>
        <% if @mddoc.settings.scripts: %>
            <% for script in @mddoc.settings.scripts: %>
                <script src="<%- script %>"></script>
            <% end %>
        <% end %>
        <script src="js/project.js"></script>



    </body>
</html>

