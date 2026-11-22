import { fetchWithAuth } from './authApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Fetch contact data (settings, dynamic offices, faqs, inquiries for admin)
 */
export async function getContactData({ admin = false } = {}) {
  try {
    const endpoint = admin ? `${API_BASE_URL}/contact/admin` : `${API_BASE_URL}/contact`;
    const res = admin 
      ? await fetchWithAuth(endpoint)
      : await fetch(endpoint);

    if (!res.ok) {
      throw new Error(`Failed to load contact data: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.warn('API getContactData failed:', error.message);
    return null;
  }
}

/**
 * Update global contact helplines & hours (Admin only)
 */
export async function updateContactSettings(settings) {
  const res = await fetchWithAuth(`${API_BASE_URL}/contact/settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update contact settings');
  }
  return await res.json();
}

/**
 * Create a new office location (Admin only)
 */
export async function createOffice(officeData) {
  const res = await fetchWithAuth(`${API_BASE_URL}/contact/offices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(officeData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create office location');
  }
  return await res.json();
}

/**
 * Update an existing office location (Admin only)
 */
export async function updateOffice(id, officeData) {
  const res = await fetchWithAuth(`${API_BASE_URL}/contact/offices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(officeData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update office location');
  }
  return await res.json();
}

/**
 * Delete an office location (Admin only)
 */
export async function deleteOffice(id) {
  const res = await fetchWithAuth(`${API_BASE_URL}/contact/offices/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete office location');
  }
  return await res.json();
}

/**
 * Submit inquiry from public contact form
 */
export async function submitInquiry(inquiryData) {
  const res = await fetch(`${API_BASE_URL}/contact/inquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiryData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to submit inquiry');
  }
  return await res.json();
}

/**
 * Update inquiry status (Admin only)
 */
export async function updateInquiryStatus(id, status) {
  const res = await fetchWithAuth(`${API_BASE_URL}/contact/inquiries/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update inquiry status');
  }
  return await res.json();
}

/**
 * Delete an inquiry record (Admin only)
 */
export async function deleteInquiry(id) {
  const res = await fetchWithAuth(`${API_BASE_URL}/contact/inquiries/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete inquiry');
  }
  return await res.json();
}

/**
 * FAQ Operations (Admin only)
 */
export async function createFaq(faqData) {
  const res = await fetchWithAuth(`${API_BASE_URL}/contact/faqs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(faqData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create FAQ');
  }
  return await res.json();
}

export async function updateFaq(id, faqData) {
  const res = await fetchWithAuth(`${API_BASE_URL}/contact/faqs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(faqData)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update FAQ');
  }
  return await res.json();
}

export async function deleteFaq(id) {
  const res = await fetchWithAuth(`${API_BASE_URL}/contact/faqs/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to delete FAQ');
  }
  return await res.json();
}
