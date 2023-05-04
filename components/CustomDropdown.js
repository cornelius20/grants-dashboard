import React from 'react'

export default function CustomDropdown({options,onChange}) {
  return (
    <select name="selectUserType" onChange={onChange}>
        {
            options.map((item,index)=>{
                return <option key={index} value={item}>{item}</option>
            })
        }
        {/* <option value="Admin">Admin</option>
        <option value="Finance">Finance</option>
        <option value="Reviewer">Reviewer</option>
        <option value="Grantee">Grantee</option> */}
    </select>
  )
}
