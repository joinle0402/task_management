<?php

namespace App\Enums;

enum VerificationCodeType: string
{
    case EMAIL_VERIFICATION = 'EMAIL_VERIFICATION';
    case PASSWORD_RESET = 'PASSWORD_RESET';
}
