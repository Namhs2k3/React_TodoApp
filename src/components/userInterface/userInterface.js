import React, { useState } from 'react';
import Select, { components } from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css'; // Đảm bảo Bootstrap được nhập vào nếu bạn sử dụng các lớp Bootstrap

const UserInterface = () => {
    const [selectedPriority, setSelectedPriority] = useState([]);

    // Các tùy chọn cho bộ lọc độ ưu tiên với màu sắc
    const priorityOptions = [
        { value: 'High', label: 'High', color: '#41B3A2', background: '#BDE8CA', border: '#41B3A2' }, // Đỏ
        { value: 'Medium', label: 'Medium', color: '#ffcc00', background: '#fff4cc', border: '#ffcc00' }, // Vàng
        { value: 'Low', label: 'Low', color: '#ff4d4d', background: '#ffe6e6', border: '#C63C51' } // Xanh lá
    ];

    // Xử lý thay đổi bộ lọc độ ưu tiên
    const handlePriorityChange = (selectedOptions) => {
        setSelectedPriority(selectedOptions);
    };

    // Tùy chỉnh cách hiển thị giá trị đã chọn
    const CustomMultiValue = (props) => {
        const { data, removeProps } = props;
        return (
            <div
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    margin: '5px',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    backgroundColor: data.background,
                    color: data.color,
                    border: `1px solid ${data.border}`
                }}
            >
                {data.label}
                <button
                    {...removeProps}
                    style={{
                        background: 'none',
                        border: 'none',
                        marginLeft: '10px',
                        cursor: 'pointer',
                        color: data.color
                    }}
                >
                    &times;
                </button>
            </div>
        );
    };

    // Tùy chỉnh cách hiển thị tùy chọn trong dropdown
    const customOption = (props) => {
        const { data, innerRef, innerProps, isFocused, isSelected } = props;
        return (
            <div
                ref={innerRef}
                {...innerProps}
                style={{
                    ...props.getStyles('option', props),
                    color: isSelected ? '#fff' : data.color,
                    backgroundColor: isSelected ? data.border : data.background,
                    border: `1px solid ${data.border}`,
                    padding: '10px',
                    borderRadius: '4px',
                    boxShadow: isFocused ? '0 0 0 2px rgba(0, 0, 0, 0.2)' : 'none'
                }}
            >
                {data.label}
            </div>
        );
    };

    return (
        <div className="container">
            <h1>Todo App</h1>
            <label className='fw-bold' htmlFor="search">Search</label><br />
            <input id="search" type="text" placeholder="Input text to search" />

            <p className='fw-bold'>Filter By Status</p>
            {/* Bộ lọc trạng thái với radio  name="stt"*/}
            <div>
                <input id="all" type="radio" name="stt" value="All" />
                <label htmlFor="all">All</label>
                <input id="completed" type="radio" name="stt" value="Completed" />
                <label htmlFor="completed">Completed</label>
                <input id="todo" type="radio" name="stt" value="Todo" />
                <label htmlFor="todo">Todo</label>
            </div>

            <p className='fw-bold'>Filter By Priority</p>
            <Select
                isMulti
                options={priorityOptions}
                value={selectedPriority}
                onChange={handlePriorityChange}
                placeholder="Select priorities..."
                components={{ MultiValue: CustomMultiValue, Option: customOption }}
            />

            {/* Render hoặc áp dụng bộ lọc dữ liệu ở đây */}
        </div>
    );
};

export default UserInterface;
