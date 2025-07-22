// Test Bengali to English course title mapping
// This file can be used to test the course title conversion

import { mapBengaliCourseTitle } from './courseTitleMapping';

const testCourseTitles = [
  'অটোক্যাড বেসিক কোর্স',
  'অটোক্যাড ২ডি এবং ৩ডি',
  'আর্কিটেকচারাল ডিজাইন প্রশিক্ষণ',
  'ইন্টেরিয়ার ডিজাইন কোর্স',
  'মেকানিক্যাল ইঞ্জিনিয়ারিং ড্রাফটিং',
  'সিভিল ইঞ্জিনিয়ারিং ডিজাইন',
  '৩ডিএস ম্যাক্স এবং ভিরে',
  'রেভিট আর্কিটেকচার',
  'স্কেচআপ প্রো',
  'ফটোশপ এবং ইলাস্ট্রেটর',
  'গ্রাফিক্স ডিজাইন কমপ্লিট',
  'ওয়েব ডিজাইন এবং ডেভেলপমেন্ট',
  'প্রফেশনাল ক্যাড ডিজাইন',
  'ইন্ডাস্ট্রিয়াল ডিজাইন এন্ড ম্যানুফ্যাকচারিং'
];

console.log('=== Course Title Mapping Test ===');
testCourseTitles.forEach(title => {
  const mapped = mapBengaliCourseTitle(title);
  console.log(`"${title}" → "${mapped}"`);
});

export { testCourseTitles };
