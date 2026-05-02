import api from './api';

export const getContacts = async (jobId) => {
  const res = await api.get(`/api/jobs/${jobId}/contacts`);
  return res.data.contacts;
};

export const createContact = async (jobId, data) => {
  const res = await api.post(`/api/jobs/${jobId}/contacts`, data);
  return res.data.contact;
};

export const updateContact = async (jobId, contactId, data) => {
  const res = await api.put(`/api/jobs/${jobId}/contacts/${contactId}`, data);
  return res.data.contact;
};

export const deleteContact = async (jobId, contactId) => {
  const res = await api.delete(`/api/jobs/${jobId}/contacts/${contactId}`);
  return res.data;
};