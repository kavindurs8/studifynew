<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('nationality');
            $table->string('contact_no');
            $table->string('linkedin_id')->nullable();
            $table->enum('expertise_area', [
                'Development',
                'Business',
                'Finance & Accounting',
                'IT & Software',
                'Office Productivity',
                'Personal Development',
                'Design',
                'Marketing',
                'Lifestyle',
                'Photography & Video',
                'Health & Fitness',
                'Music',
                'Teaching & Academics',
                'Other'
            ]);
            $table->enum('teaching_experience', ['0', '0 - 1', '1 - 3', '3 - 5', '5 + years']);
            $table->string('recent_company');
            $table->string('recent_qualification');
            $table->string('university_name');
            $table->text('specialization')->nullable();
            $table->string('cv_path')->nullable();
            $table->enum('status', ['Not Approved', 'Approved', 'Rejected'])->default('Not Approved');
            $table->string('otp_code', 6)->nullable();
            $table->timestamp('otp_expires_at')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('teachers');
    }
};
