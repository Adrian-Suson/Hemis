<!-- resources/views/app.blade.php -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>My React + Laravel App</title>
    <!-- If using Vite, you might include the @vite directive or references to built files -->
</head>
<body>
    <div id="root"></div>
    <!-- Example if using Vite in Laravel 9+ -->
    @viteReactRefresh
    @vite('resources/js/main.jsx')
</body>
</html>
