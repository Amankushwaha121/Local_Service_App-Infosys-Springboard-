import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const adminUser = (() => {
    try {
      const saved = localStorage.getItem('adminUser');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:8080/api/admin/users');
      if (res.data && res.data.success) {
        setUsers(res.data.data || []);
      } else {
        setError(res.data?.message || 'Failed to load users');
      }
    } catch (err) {
      console.error('Error loading users', err);
      setError('Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:8080/api/admin/providers');
      if (res.data && res.data.success) {
        setProviders(res.data.data || []);
      } else {
        setError(res.data?.message || 'Failed to load providers');
      }
    } catch (err) {
      console.error('Error loading providers', err);
      setError('Error loading providers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProviders();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      const res = await axios.delete(`http://localhost:8080/api/admin/users/${id}`);
      if (res.data && res.data.success) {
        setMessage('User deleted successfully');
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        setError(res.data?.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Delete user error', err);
      setError('Delete user failed');
    }
  };

  const handleDeleteProvider = async (id) => {
  if (!window.confirm('Delete this provider permanently?')) return;
  try {
    const res = await axios.delete(`http://localhost:8080/api/providers/${id}`);
    if (res.data && res.data.success) {
      setMessage('Provider deleted successfully');
      await fetchProviders();
    } else {
      setError(res.data?.message || 'Failed to delete provider');
    }
  } catch (err) {
    console.error('Delete provider error', err);
    setError('Delete provider failed');
  }
};


  const handleToggleVerify = async (provider) => {
    const newStatus = !provider.isVerified;
    try {
      const res = await axios.put(
        `http://localhost:8080/api/admin/providers/${provider.id}/verify`,
        null,
        { params: { status: newStatus } }
      );
      if (res.data && res.data.success) {
        setMessage(newStatus ? 'Provider verified' : 'Provider unverified');
        setProviders((prev) =>
          prev.map((p) =>
            p.id === provider.id ? { ...p, isVerified: newStatus } : p
          )
        );
      } else {
        setError(res.data?.message || 'Failed to update verification');
      }
    } catch (err) {
      console.error('Verify provider error', err);
      setError('Failed to update verification');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-blue-100">
            Manage all customers and service providers
          </p>
        </div>
        <div className="flex items-center gap-4">
          {adminUser && (
            <div className="text-right">
              <div className="text-sm font-medium">{adminUser.username}</div>
              <div className="text-xs text-blue-100">{adminUser.role}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded bg-white text-blue-600 text-sm font-medium shadow"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-6 px-4">
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => setActiveTab('users')}
            className={
              'px-4 py-2 rounded-t border-b-2 text-sm font-medium ' +
              (activeTab === 'users'
                ? 'border-blue-600 bg-white'
                : 'border-transparent bg-gray-200')
            }
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('providers')}
            className={
              'px-4 py-2 rounded-t border-b-2 text-sm font-medium ' +
              (activeTab === 'providers'
                ? 'border-blue-600 bg-white'
                : 'border-transparent bg-gray-200')
            }
          >
            Providers ({providers.length})
          </button>
        </div>

        {message && (
          <div className="mb-3 px-4 py-2 bg-green-100 text-green-800 text-sm rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-3 px-4 py-2 bg-red-100 text-red-800 text-sm rounded">
            {error}
          </div>
        )}

        {loading && (
          <div className="py-10 text-center text-gray-500 text-sm">
            Loading...
          </div>
        )}

        {!loading && activeTab === 'users' && (
          <div className="bg-white shadow rounded p-4 overflow-x-auto">
            {users.length === 0 ? (
              <div className="text-sm text-gray-500">No users found.</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-3 py-2">ID</th>
                    <th className="text-left px-3 py-2">Name</th>
                    <th className="text-left px-3 py-2">Email</th>
                    <th className="text-left px-3 py-2">Phone</th>
                    <th className="text-left px-3 py-2">Location</th>
                    <th className="text-right px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="px-3 py-2">{u.id}</td>
                      <td className="px-3 py-2">{u.name}</td>
                      <td className="px-3 py-2">{u.email}</td>
                      <td className="px-3 py-2">{u.phone}</td>
                      <td className="px-3 py-2">{u.location}</td>
                      <td className="px-3 py-2 text-right">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="px-3 py-1 rounded text-xs bg-red-100 text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {!loading && activeTab === 'providers' && (
          <div className="bg-white shadow rounded p-4 overflow-x-auto">
            {providers.length === 0 ? (
              <div className="text-sm text-gray-500">No providers found.</div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left px-3 py-2">ID</th>
                    <th className="text-left px-3 py-2">Name</th>
                    <th className="text-left px-3 py-2">Business</th>
                    <th className="text-left px-3 py-2">Email</th>
                    <th className="text-left px-3 py-2">Location</th>
                    <th className="text-left px-3 py-2">Verified</th>
                    <th className="text-right px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {providers.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="px-3 py-2">{p.id}</td>
                      <td className="px-3 py-2">{p.name}</td>
                      <td className="px-3 py-2">{p.businessName}</td>
                      <td className="px-3 py-2">{p.email}</td>
                      <td className="px-3 py-2">{p.location}</td>
                      <td className="px-3 py-2">
                        {p.isVerified ? (
                          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                            Verified
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right space-x-2">
                        <button
                          onClick={() => handleToggleVerify(p)}
                          className="px-3 py-1 rounded text-xs bg-blue-100 text-blue-700"
                        >
                          {p.isVerified ? 'Unverify' : 'Verify'}
                        </button>
                        <button
                          onClick={() => handleDeleteProvider(p.id)}
                          className="px-3 py-1 rounded text-xs bg-red-100 text-red-700">
                          Delete
                        </button>

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
