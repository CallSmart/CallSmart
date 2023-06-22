"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../supabase';
import Sidebar from '@/components/sidebar';

interface Clinic {
  id: number;
  name: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [newClinicName, setNewClinicName] = useState('');

  useEffect(() => {
    const session = supabase.auth.getSession();
    if (!session) {
      router.push('/');
    } else {
      fetchClinics();
    }
  }, []);

  const fetchClinics = async () => {
    const { data, error } = await supabase
      .from('clinics')
      .select()
      .order('name', { ascending: true });
    if (error) {
      console.error('Error fetching clinics:', error.message);
    } else {
      console.log('data', data)
      setClinics(data || []);
    }
  };

  const addClinic = async () => {
    // insert new clinic into database
    const { error } = await supabase.from('clinics').insert([{ name: newClinicName }]);
    if (error) {
      console.error('Error adding clinic:', error.message);
    } else {
      setNewClinicName('');
      fetchClinics();
    }
  };
  const deleteClinic = async (id: number) => {
    const { error } = await supabase.from('clinics').delete().eq('id', id);
    if (error) {
      console.error('Error deleting clinic:', error.message);
    } else {
      setClinics((prevClinics) => prevClinics.filter((clinic) => clinic.id !== id));
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/'); // Redirect to login after signing out
    }
  };

  return (
    <Sidebar>
      <div className="text-blue-500">
        <h1>Profile</h1>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
      <div className="mt-4">
        <h2>Add Clinic</h2>
        <input
          type="text"
          value={newClinicName}
          onChange={(e) => setNewClinicName(e.target.value)}
        />
        <button onClick={addClinic}>Add</button>
      </div>
      <div className="mt-4">
        <h2>Clinics</h2>
        <ul>
          {clinics.map((clinic) => (
            <li key={clinic.id}>
              {clinic.name}{' '}
              <button onClick={() => deleteClinic(clinic.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </Sidebar>
  );
}
