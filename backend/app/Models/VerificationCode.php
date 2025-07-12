<?php

namespace App\Models;

use App\Enums\VerificationCodeType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property string $code
 * @property VerificationCodeType $type
 * @property \Illuminate\Support\Carbon $expired_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode whereCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode whereExpiredAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|VerificationCode whereUserId($value)
 * @mixin \Eloquent
 */
class VerificationCode extends Model
{
    protected $fillable = ['user_id', 'code', 'type', 'expired_at'];
    protected $casts = [
        'type' => VerificationCodeType::class,
        'expired_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
