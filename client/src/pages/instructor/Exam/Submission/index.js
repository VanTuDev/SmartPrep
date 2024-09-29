import { Input, Space } from 'antd';
const { Search } = Input;

function Submission() {
    const onSearch = (value, _e, info) => console.log(info?.source, value);
    return (
        <>
            <div className="w-4/5 mx-auto mt-5">
                <div className='mb-4'>
                    <Search
                        size='large'
                        placeholder="Type search keywords"
                        onSearch={onSearch}
                        style={{
                            width: 300,
                        }}
                    />
                </div>
            </div>
        </>
    );
}

export default Submission;