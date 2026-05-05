export function canManageCourses(role) {
  return role === 'Admin' || role === 'Instructor';
}

export function canListEnrollments(role) {
  return role === 'Admin' || role === 'Instructor';
}

export function canCreateEnrollment(role) {
  return role === 'Admin' || role === 'Student';
}

export function canDeleteEnrollment(role) {
  return role === 'Admin';
}

export function canAccessEnrollmentsPage(role) {
  return canListEnrollments(role) || canCreateEnrollment(role);
}
