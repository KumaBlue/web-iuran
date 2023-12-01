import React, { useEffect, useState, useRef  } from 'react'
import Layout from '../Layout/Layout'
import ModalForm from '../components/ModalForm';
import { Link, useNavigate } from 'react-router-dom';
import { FaCirclePlus } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import 'datatables.net-dt/css/jquery.dataTables.css'; // Import DataTables CSS
import 'datatables.net'; // Import DataTables\
import $ from 'jquery';
import axios from 'axios';


const Laporan = () => {
    const [showModal, setShowModal] = useState(false);
    const [modal, setModal] = useState("");
    const [tahun, setTahun] = useState(0);
    const [year, setYears] = useState([]);
    const tableRef = useRef(null);
    const [id, setId] = useState('')
    const [years, setYear] = useState('')

    function handleSubmit(event) {
        event.preventDefault();
        navigate("/laporan");
        setShowModal(!showModal);
        axios.post('http://localhost:8081/laporan', {id, years})
        .then(res => {
            console.log(res);
            window.location.reload();
        }).catch(err => console.log(err));
    }
    const handleSelectChange = (e) => {
        setYear(e.target.value);
        setId(e.target.value);
    }

    useEffect(() => {
        let counter = 1;
        // Initialize DataTables after data is loaded
        if (tableRef.current) {
            $(tableRef.current).DataTable({
                destroy: true, // Destroy any existing DataTable instance
                data: year,
                columns: [
                    { title: 'No', render: function (data, type, row, meta) { // Langkah 2: Tambahkan kolom nomor urut
                        return counter++;
                    } },
                    { title: 'ID', data: 'ID', visible: false  },
                    { title: 'Tahun', data: 'years'},
                    {
                        title: 'Action',
                        render: function (data, type, row, meta) {
                            const id = row.ID; // replace 'id' with the actual field name from your data
                            const tahun = row.tahun; // replace 'tahun' with the actual field name from your data
                            return `
                                <a href="/tahun/${id}" class='btn btn-success'>Open</a>
                                <button class='btn btn-danger delete-button' data-id=${id}>Delete</button>
                            `;
                        },
                    },
                ],
            });
            $(tableRef.current).on('click', '.delete-button', function() {
                const id = $(this).data('id');
                handleDelete(id);
            });
        }
    }, [year]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/deletetahun/${id}`);
            window.location.reload();
        } catch (err) {
            console.error('Error in DELETE request:', err);
        }
    };

    useEffect(() => {
        axios.get('http://localhost:8081/laporan')
            .then(res => setYears(res.data))
            .catch(err => console.log(err));
    }, []);

    const navigate = useNavigate();
    
    function handleAddModal() {
        setShowModal(!showModal);
        setModal("create-modal");
    }

    function handleEditModal() {
        setShowModal(!showModal);
        setModal("edit-modal");
    }

    function handleDeleteModal() {
        setShowModal(!showModal);
        setModal("delete-modal");
    }

    return (
        <Layout>
            <div className="flex flex-col gap-5">
                <div className="flex justify-between">
                    <h1 className="text-xl text-[#222222] font-medium">Laporan</h1>
                    <button className="bg-main-orange flex items-center gap-1 text-[#FFFFFF] px-3 py-1 rounded-md" onClick={handleAddModal}>
                        <FaCirclePlus />
                        <p className="text-xs hidden xs:block">Tambah laporan</p>
                    </button>
                </div>  

                <div className="bg-[#FFFFFF] rounded-sm min-w-[150px]">
                    <div className="p-3">
                        <div className="overflow-x-auto rounded-t-md">
                            <table ref={tableRef} className="w-full min-w-full table-auto text-left border border-main-orange" id="example">
                            <thead className="bg-main-orange text-[#FFFFFF] text-center text-xs">
                                    <tr className="h-10">
                                        <th scope="col" className="whitespace-nowrap px-2 ">No</th>
                                        <th scope="col" className="whitespace-nowrap px-3 ">Tahun</th>
                                        <th scope="col" className="whitespace-nowrap px-3 ">Detail</th>
                                        <th scope="col" className="whitespace-nowrap px-3 ">Aksi</th>
                                    </tr>
                                </thead>

                                <tbody className="font-medium text-xs text-center">
                                <tr className="border border-b border-main-orange">
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    
                </div>

            </div>
            
            <ModalForm id="create-modal" modalType={modal} showModal={showModal} setShowModal={setShowModal} title="Tambah data laporan tahunan">
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="tahun" className="text-sm font-medium">Tahun</label>
                                    <select type="number" placeholder="Input tahun" onChange={e => handleSelectChange(e)} className="w-full py-1 px-3 border border-[#CCCCCC] rounded-md placeholder:text-sm focus:outline-none">
                                    <option value="0" disabled selected>Select Year...</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                </select>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button type="submit" className="bg-green-500 text-[#FFFFFF] text-sm font-medium px-5 py-2 rounded-md">Tambah</button>
                            </div>
                        </div>
                    </form>
                </div>
            </ModalForm>

            <ModalForm id="edit-modal" modalType={modal} showModal={showModal} setShowModal={setShowModal} title="Ubah data laporan tahunan">
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="tahun" className="text-sm font-medium">Tahun</label>
                                    <input type="number" id="tahun" value={tahun} placeholder="Input tahun" onChange={e => { setTahun(e.target.value)}} className="w-full py-1 px-3 border border-[#CCCCCC] rounded-md placeholder:text-sm focus:outline-none"/>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button type="submit" className="bg-green-500 text-[#FFFFFF] text-sm font-medium px-5 py-2 rounded-md">Ubah</button>
                            </div>
                        </div>
                    </form>
                </div>
            </ModalForm>

            <ModalForm id="delete-modal"  modalType={modal} showModal={showModal} setShowModal={setShowModal} title="Hapus data laporan tahunan">
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-5">
                            <div>
                                <p className="text-sm">Apakah anda yakin ingin menghapus data ini?</p>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button className="bg-gray-500 text-[#FFFFFF] text-sm font-medium py-2 px-3 rounded-md" onClick={() => {console.log(setShowModal)}}>Cancel</button>
                                <button type="submit" className="bg-red-500 text-[#FFFFFF] text-sm font-medium py-2 px-3 rounded-md">Hapus</button>
                            </div>
                        </div>
                    </form>
                </div>
            </ModalForm>

        </Layout>
  )
}

export default Laporan