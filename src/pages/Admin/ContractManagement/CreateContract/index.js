import classNames from "classnames/bind";
import styles from "./CreateContract.module.scss";

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
const cx = classNames.bind(styles);

function CreateContract() {
  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <div className={cx("container-create")}>
      <div className={cx("header")}>
        <h1 className={cx("j")}>Create Contract</h1>
      </div>
      <div className={cx("body")}>
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 6, width: "50ch" } }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              id="outlined-required"
              label="Khách hàng"
              defaultValue="Hello World"
              sx={{
                // Điều chỉnh kích thước của thẻ TextField
                width: "300px",
                // Điều chỉnh kích thước của label
                "& .MuiInputLabel-root": { fontSize: "18px" },
                // Điều chỉnh kích thước của value
                "& .MuiInputBase-input": { fontSize: "16px" },
                marginTop: "50px",
                height: "0px",
              }}
            />
            <FormControl sx={{ minWidth:250, marginTop: '50px' }}>
              <InputLabel id="demo-simple-select-label">DS Phòng</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Age"
                onChange={handleChange}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
            </FormControl>
            <TextField
              id="outlined-required"
              label="DS phòng chọn thuê"
              defaultValue="Hello World"
              sx={{
                // Điều chỉnh kích thước của thẻ TextField
                width: "300px",
                // Điều chỉnh kích thước của label
                "& .MuiInputLabel-root": { fontSize: "18px" },
                // Điều chỉnh kích thước của value
                "& .MuiInputBase-input": { fontSize: "16px" },
                marginLeft: "50px",
              }}
            />
          </div>
        </Box>
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 6, width: "80ch" } }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              id="outlined-required"
              label="Name Client"
              defaultValue="Hello World"
              sx={{
                // Điều chỉnh kích thước của thẻ TextField
                width: "300px",
                // Điều chỉnh kích thước của label
                "& .MuiInputLabel-root": { fontSize: "18px" },
                // Điều chỉnh kích thước của value
                "& .MuiInputBase-input": { fontSize: "16px" },
                marginTop: "50px",
              }}
            />
            <TextField
              id="outlined-required"
              label="Name Client"
              defaultValue="Hello World"
              sx={{
                // Điều chỉnh kích thước của thẻ TextField
                width: "300px",
                // Điều chỉnh kích thước của label
                "& .MuiInputLabel-root": { fontSize: "18px" },
                // Điều chỉnh kích thước của value
                "& .MuiInputBase-input": { fontSize: "16px" },
                marginLeft: "50px",
              }}
            />
            <TextField
              id="outlined-required"
              label="Name Client"
              defaultValue="Hello World"
              sx={{
                // Điều chỉnh kích thước của thẻ TextField
                width: "300px",
                // Điều chỉnh kích thước của label
                "& .MuiInputLabel-root": { fontSize: "18px" },
                // Điều chỉnh kích thước của value
                "& .MuiInputBase-input": { fontSize: "16px" },
                marginLeft: "50px",
              }}
            />
            <TextField
              id="outlined-required"
              label="Name Client"
              defaultValue="Hello World"
              sx={{
                // Điều chỉnh kích thước của thẻ TextField
                width: "300px",
                // Điều chỉnh kích thước của label
                "& .MuiInputLabel-root": { fontSize: "18px" },
                // Điều chỉnh kích thước của value
                "& .MuiInputBase-input": { fontSize: "16px" },
                marginLeft: "50px",
              }}
            />
          </div>
        </Box>
        <Button
          variant="contained"
          sx={{
            fontSize: "16px", // Kích thước chữ
            padding: "10px 20px", // Padding cho nút
            width: "170px", // Chiều rộng của nút (tuỳ chọn)
            height: "40px",
            position: "absolute",
            right: "100px", // Chiều cao của nút (tuỳ chọn)
          }}
        >
          TẠO HỢP ĐỒNG
        </Button>
      </div>
    </div>
  );
}

export default CreateContract;
