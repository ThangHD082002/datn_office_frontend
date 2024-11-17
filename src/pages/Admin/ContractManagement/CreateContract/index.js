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
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
const cx = classNames.bind(styles);

function CreateContract() {
  const { cid } = useParams();
  const [codeContract, setCodeContract] = useState("");
  const [contractType, setContractType] = useState();
  const [listOffice, setListOffice] = useState([]);
  const [tenantId, setTenantId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState("");
  const [depositAmount, setDepositAmount] = useState();
  const [paymentFrequency, setPaymentFrequency] = useState();
  const [handoverDate, setHandoverDate] = useState("");
  const [rentalPurpose, setRentalPurpose] = useState("");
  const navigate = useNavigate();

  const [alertStateBook, setAlertStateBook] = useState("");
  const [alertText, setAlertText] = useState("");
  const [open, setOpen] = useState(false);

  let token = localStorage.getItem("authToken");
  useEffect(() => {
    axios
      .get(`https://orca-app-khbcx.ondigitalocean.app/api/requests/${cid}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(function (response) {
        console.log(response);
        const ids = response.data.officeDTOs.map((office) => office.id);
        setListOffice(ids);
        setTenantId(response.data.userId);
        setTenantId(response.data.userId);
      })
      .catch(function (error) {
        if (error.response && error.response.status === 401) {
          // Chuyển đến trang /error-token nếu mã lỗi là 401 Unauthorized
          window.location.href = "/error-token";
        }
      })
      .finally(function () { });
  }, []);

  console.log(listOffice);

  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleChangeContractCodeChange = (event) => {
    setCodeContract(event.target.value);
  };
  const handleChangeDuration = (event) => {
    setDuration(event.target.value);
  };
  const handleChangeRentalPurpose = (event) => {
    setRentalPurpose(event.target.value);
  };
  const handleChangePaymentFrequency = (event) => {
    setPaymentFrequency(event.target.value);
  };
  const handleChangeTypeContract = (event) => {
    setContractType(event.target.value);
  };

  const handleChangeStartDate = (newDate) => {
    setStartDate(dayjs(newDate).format("YYYY-MM-DD")); // Định dạng lại theo ý muốn, ví dụ 'YYYY-MM-DD'
  };
  const handleChangeEndDate = (newDate) => {
    setEndDate(dayjs(newDate).format("YYYY-MM-DD")); // Định dạng lại theo ý muốn, ví dụ 'YYYY-MM-DD'
  };
  const handleChangeHandOverDate = (newDate) => {
    setHandoverDate(dayjs(newDate).format("YYYY-MM-DD")); // Định dạng lại theo ý muốn, ví dụ 'YYYY-MM-DD'
  };

  const handleChangeDepositAmount = (event) => {
    setDepositAmount(event.target.value);
  };

  const handleClickk = () => {
    setOpen(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const SubmitCreateContract = () => {
    axios
      .post(
        "https://orca-app-khbcx.ondigitalocean.app/api/contract/save",
        {
          code: codeContract, // mã hợp đồng
          request: {
            offices: listOffice,
            tenantId: tenantId,
          },
          codeContract: codeContract,
          startDate: startDate, // ngày bắt đầu thuê
          endDate: endDate, // ngày kết thúc
          duration: duration, // thời hạn
          depositAmount: depositAmount, // tiền đặt cọc
          paymentFrequency: paymentFrequency, // chu kì đóng tiền
          contractType: contractType, // loại
          handoverDate: handoverDate, // ngày bàn giao mặt bằng
          rentalPurpose: rentalPurpose, // mục đích thuê.
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(function (response) {
        console.log("STATE REQUEST");
        console.log(response);
        setAlertStateBook("success");
        setAlertText("Hợp đồng được tạo thành công !");
        // navigate("/admin/contracts");
      })
      .catch(function (error) {
        console.log(error);
        setAlertStateBook("error");
        setAlertText("Hệ thống đang gặp lỗi, vui lòng load lại trang !");
      })
      .finally(function () { });
  };

  useEffect(() => {
    if (alertText !== "" && alertText === "Hợp đồng được tạo thành công !") {
      handleClickk();

      // Đặt timeout 4 giây trước khi reload trang
      const timer = setTimeout(() => {
        window.location.reload();
      }, 2300);
      // Hủy bỏ timer nếu `alertText` thay đổi trước khi 4 giây hoàn thành
      return () => clearTimeout(timer);
    }
  }, [alertText]);
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
            <FormControl sx={{ minWidth: 250, marginTop: '50px' }}>
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
