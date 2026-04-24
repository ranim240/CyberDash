import { useState, useEffect } from 'react';
import api from '../services/api';
const MOCK_COURSES = [
  {
    course_id: 'c-001',
    title: 'Web Application Security',
    description: 'Learn to identify and exploit common web vulnerabilities including XSS, CSRF, and SQL Injection.',
    level: 'beginner',
    estimated_duration: 180,
    is_published: true,
    created_at: '2024-11-10T08:00:00Z',
    instructor_id: 'inst-001',
  },
  {
    course_id: 'c-002',
    title: 'Network Penetration Testing',
    description: 'Master the art of network recon, scanning, and exploitation using industry-standard tools.',
    level: 'intermediate',
    estimated_duration: 240,
    is_published: true,
    created_at: '2024-12-01T10:30:00Z',
    instructor_id: 'inst-001',
  },
  {
    course_id: 'c-003',
    title: 'Reverse Engineering Fundamentals',
    description: 'Dive into binary analysis, disassembly, and understanding compiled code.',
    level: 'advanced',
    estimated_duration: 320,
    is_published: false,
    created_at: '2025-01-15T14:00:00Z',
    instructor_id: 'inst-001',
  },
  {
    course_id: 'c-004',
    title: 'Cryptography & Secure Protocols',
    description: 'Understand encryption algorithms, PKI, TLS, and how to break weak implementations.',
    level: 'intermediate',
    estimated_duration: 150,
    is_published: false,
    created_at: '2025-02-20T09:00:00Z',
    instructor_id: 'inst-001',
  },
  {
    course_id: 'c-005',
    title: 'Linux Privilege Escalation',
    description: 'Techniques and tools to escalate privileges on Linux systems during penetration tests.',
    level: 'advanced',
    estimated_duration: 200,
    is_published: true,
    created_at: '2025-03-05T11:00:00Z',
    instructor_id: 'inst-001',
  },
];
export function useCourses() {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    api.get('/courses')
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : res.data.data ?? MOCK_COURSES;
        setCourses(all); // ← no filter, show everything
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading, error };
}