import React from 'react';
import CardDataStats from 'components/Statistics/CardDataStats';
import { BookOpenCheck, School, Users } from 'lucide-react';
import AdminDashboardTable from 'components/Table/AdminDashboardTable';
import StudentTopTable from 'components/Table/StudentTopTable';

const AdminDashboard = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total users" total="$3.456K" rate="0.43%" levelUp >
          <Users />
        </CardDataStats>
        <CardDataStats title="Total classes" total="$3.456K" rate="0.43%" levelUp >
          <School />
        </CardDataStats>
        <CardDataStats title="Total exams" total="$3.456K" rate="0.43%" levelUp >
          <BookOpenCheck />
        </CardDataStats>
        <CardDataStats title="Total questions" total="$3.456K" rate="0.43%" levelUp >
          <BookOpenCheck />
        </CardDataStats>
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <AdminDashboardTable />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <StudentTopTable/>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
