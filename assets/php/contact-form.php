<?php
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    $to = 'jamitengol@hotmail.com'; //<-- E-mail de destino atualizado.
    $subject = $_POST['subject'];

    $body = "From: $name <br> E-Mail: $email <br> Message: <br> $message";

    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
    $headers .= 'From:' . $email. "\r\n";
    $headers .= 'Cc:' . $email. "\r\n";

    mail($to, "New Message from Website: $subject", $body, $headers);

    // Envia e-mail para o cliente confirmando o recebimento
    $confirm_subject = "Recebemos sua mensagem!";
    $confirm_body = "Olá $name,<br><br>Recebemos sua mensagem e em breve entraremos em contato.<br><br>Mensagem enviada:<br>" . nl2br($message) . "<br><br>Atenciosamente,<br>Jamite Ngola";
    $confirm_headers  = 'MIME-Version: 1.0' . "\r\n";
    $confirm_headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
    $confirm_headers .= 'From: jamitengol@hotmail.com' . "\r\n";
    mail($email, $confirm_subject, $confirm_body, $confirm_headers);
?>