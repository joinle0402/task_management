<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * 
 *
 * @property int $id
 * @property int $user_id
 * @property string $token
 * @property \Illuminate\Support\Carbon $expired_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\User $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefreshToken newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefreshToken newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefreshToken query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefreshToken whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefreshToken whereExpiredAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefreshToken whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefreshToken whereToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefreshToken whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RefreshToken whereUserId($value)
 * @mixin Eloquent
 */
class RefreshToken extends Model
{
    protected $fillable = ['user_id', 'token', 'expired_at'];
    protected $casts = ['expired_at' => 'datetime'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
