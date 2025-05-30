<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Development',
                'description' => 'Web Development, Mobile Apps, Programming Languages, Game Development, Database Design & Development, Software Testing, Software Engineering, Development Tools',
                'icon' => 'fa-code',
                'color' => '#3B82F6',
                'sort_order' => 1
            ],
            [
                'name' => 'Business',
                'description' => 'Entrepreneurship, Communication, Management, Sales, Business Strategy, Operations, Project Management, Business Law, Business Analytics & Intelligence, Human Resources',
                'icon' => 'fa-briefcase',
                'color' => '#10B981',
                'sort_order' => 2
            ],
            [
                'name' => 'Finance & Accounting',
                'description' => 'Accounting & Bookkeeping, Compliance, Cryptocurrency & Blockchain, Economics, Finance, Finance Cert & Exam Prep, Financial Modeling & Analysis, Investing & Trading, Money Management Tools, Taxes',
                'icon' => 'fa-dollar-sign',
                'color' => '#F59E0B',
                'sort_order' => 3
            ],
            [
                'name' => 'IT & Software',
                'description' => 'IT Certifications, Network & Security, Hardware, Operating Systems, Other IT & Software',
                'icon' => 'fa-laptop',
                'color' => '#8B5CF6',
                'sort_order' => 4
            ],
            [
                'name' => 'Office Productivity',
                'description' => 'Microsoft, Apple, Google, SAP, Oracle, Other Office Productivity',
                'icon' => 'fa-chart-line',
                'color' => '#06B6D4',
                'sort_order' => 5
            ],
            [
                'name' => 'Personal Development',
                'description' => 'Personal Transformation, Personal Productivity, Leadership, Career Development, Parenting & Relationships, Happiness',
                'icon' => 'fa-user-plus',
                'color' => '#EF4444',
                'sort_order' => 6
            ],
            [
                'name' => 'Design',
                'description' => 'Web Design, Graphic Design & Illustration, Design Tools, User Experience Design, Game Design, 3D & Animation, Fashion Design, Architectural Design, Interior Design, Other Design',
                'icon' => 'fa-palette',
                'color' => '#EC4899',
                'sort_order' => 7
            ],
            [
                'name' => 'Marketing',
                'description' => 'Digital Marketing, Search Engine Optimization, Social Media Marketing, Branding, Marketing Fundamentals, Analytics & Automation, Public Relations, Advertising, Video & Mobile Marketing, Content Marketing, Growth Hacking, Affiliate Marketing, Product Marketing, Other Marketing',
                'icon' => 'fa-bullhorn',
                'color' => '#F97316',
                'sort_order' => 8
            ],
            [
                'name' => 'Lifestyle',
                'description' => 'Arts & Crafts, Beauty & Makeup, Esoteric Practices, Food & Beverage, Gaming, Home Improvement & Gardening, Pet Care & Training, Travel, Other Lifestyle',
                'icon' => 'fa-heart',
                'color' => '#84CC16',
                'sort_order' => 9
            ],
            [
                'name' => 'Photography & Video',
                'description' => 'Digital Photography, Photography, Portrait Photography, Photography Tools, Commercial Photography, Video Design, Other Photography & Video',
                'icon' => 'fa-camera',
                'color' => '#6366F1',
                'sort_order' => 10
            ],
            [
                'name' => 'Health & Fitness',
                'description' => 'Fitness, General Health, Sports, Nutrition & Diet, Yoga, Mental Health, Martial Arts & Self Defense, Safety & First Aid, Dance, Meditation, Other Health & Fitness',
                'icon' => 'fa-dumbbell',
                'color' => '#14B8A6',
                'sort_order' => 11
            ],
            [
                'name' => 'Music',
                'description' => 'Instruments, Music Production, Music Fundamentals, Vocal, Music Techniques, Music Software, Other Music',
                'icon' => 'fa-music',
                'color' => '#A855F7',
                'sort_order' => 12
            ],
            [
                'name' => 'Teaching & Academics',
                'description' => 'Engineering, Humanities, Math, Science, Online Education, Social Science, Language Learning, Teacher Training, Test Prep, Other Teaching & Academics',
                'icon' => 'fa-graduation-cap',
                'color' => '#059669',
                'sort_order' => 13
            ],
            [
                'name' => 'Other',
                'description' => 'Other categories not listed above',
                'icon' => 'fa-ellipsis-h',
                'color' => '#6B7280',
                'sort_order' => 14
            ]
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
