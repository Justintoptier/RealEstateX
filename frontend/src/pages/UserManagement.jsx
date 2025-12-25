import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Building2, ArrowLeft, UserPlus, Trash2, Shield, User } from 'lucide-react';
import { getMockUsers, addUser, deleteUser, updateUserRole } from '../mockData';
import { useToast } from '../hooks/use-toast';

const UserManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'user'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Load users error:', error);
    }
  };

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-white font-serif text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 text-center mb-6">
              Only administrators can manage users.
            </p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-amber-200 hover:bg-amber-300 text-black font-medium transition-all duration-300"
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!newUser.name || !newUser.email) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          username: newUser.name,
          email: newUser.email,
          role: newUser.role
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      await loadUsers();
      
      toast({
        title: 'Success',
        description: 'User added successfully!',
        variant: 'default'
      });

      setNewUser({ name: '', email: '', role: 'user' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Add user error:', error);
      toast({
        title: 'Error',
        description: 'Failed to add user. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        await loadUsers();
        
        toast({
          title: 'Success',
          description: 'User deleted successfully!',
          variant: 'default'
        });
      } catch (error) {
        console.error('Delete user error:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete user.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/role?new_role=${newRole}`, {
        method: 'PATCH',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      await loadUsers();
      
      toast({
        title: 'Success',
        description: `User role updated to ${newRole}`,
        variant: 'default'
      });
    } catch (error) {
      console.error('Update role error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-amber-200" strokeWidth={1.5} />
            <span className="text-2xl font-serif text-white">MAK Kotwal Venus</span>
          </div>
          <div className="text-right">
            <p className="text-white font-medium">{user?.name || 'Admin'}</p>
            <p className="text-amber-200 text-sm">{user?.role || 'admin'}</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/dashboard')}
          variant="ghost"
          className="text-amber-200 hover:text-amber-300 hover:bg-amber-200/10 mb-8 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif text-white mb-2">User Management</h1>
            <p className="text-gray-400">Manage users and permissions</p>
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-amber-200 hover:bg-amber-300 text-black font-medium transition-all duration-300"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-white font-serif">Add New User</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-300 mb-2 block">Name *</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Enter user name"
                      required
                      className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-300 mb-2 block">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Enter email address"
                      required
                      className="bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-200 focus:ring-amber-200/20 transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">Role</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="radio"
                        value="user"
                        checked={newUser.role === 'user'}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="text-amber-200 focus:ring-amber-200"
                      />
                      User
                    </label>
                    <label className="flex items-center gap-2 text-white cursor-pointer">
                      <input
                        type="radio"
                        value="admin"
                        checked={newUser.role === 'admin'}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                        className="text-amber-200 focus:ring-amber-200"
                      />
                      Admin
                    </label>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="bg-amber-200 hover:bg-amber-300 text-black font-medium transition-all duration-300"
                  >
                    Add User
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800 transition-all duration-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        <div className="grid gap-4">
          {users.map((u) => (
            <Card key={u.user_id} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-900/70 transition-all duration-300">
              <CardContent className="py-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      src={u.picture}
                      alt={u.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className="text-white font-medium text-lg">{u.name}</h3>
                      <p className="text-gray-400 text-sm">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-black/50 rounded">
                      {u.role === 'admin' ? (
                        <Shield className="w-4 h-4 text-amber-200" />
                      ) : (
                        <User className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={u.role === 'admin' ? 'text-amber-200' : 'text-gray-400'}>
                        {u.role}
                      </span>
                    </div>
                    <Button
                      onClick={() => handleToggleRole(u.user_id, u.role)}
                      variant="outline"
                      size="sm"
                      className="border-amber-200 text-amber-200 hover:bg-amber-200 hover:text-black transition-all duration-300"
                    >
                      {u.role === 'admin' ? 'Make User' : 'Make Admin'}
                    </Button>
                    <Button
                      onClick={() => handleDeleteUser(u.user_id)}
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
