<!DOCTYPE html>
<html>
    <head>
        <title>Redirecting to application…</title>
        <meta http-equiv="refresh" content="0; url={{ $targetUrl }}">
        <script>
            window.location.href = "{{ $targetUrl }}";
        </script>
    </head>
    <body>
        Redirecting to application…
    </body>
</html>
