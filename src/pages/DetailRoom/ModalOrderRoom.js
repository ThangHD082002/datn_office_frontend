
import React from "react";
import { Stepper, Step, StepLabel, Box, Typography, Button, Grid, Card, CardMedia, CardContent, FormControlLabel, Checkbox } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames/bind";
import { useRef, useEffect, useState } from 'react'
import styles from "./ModalOrderRoom.module.scss";

const cx = classNames.bind(styles);


function ModalOrderRoom(
    {
  activeStep,
  steps,
  room,
  managers,
  selectedIds,
  valueInputs,
  handleNext,
  handleBack,
  handleReset,
  isStepOptional,
  isStepSkipped,
  handleSkip,
  hanleHidePopup,
  changeInput,
  showListFloor,
  showListFloorMain,
  inputRefs,
  labelRefs,
}
) {
    return (
        <div>
        <div className={cx('center')} ref={showListFloor}>
          <div className={cx('tickets')} ref={showListFloorMain}>
            <Box sx={{ width: '100%' }}>
              <Stepper
                activeStep={activeStep}
                sx={{ height: '50px', padding: '10px 0' }} // Tăng chiều cao và padding của Stepper
              >
                {steps.map((label, index) => {
                  const stepProps = {}
                  const labelProps = {}
                  if (isStepOptional(index)) {
                    labelProps.optional = (
                      <Typography variant="caption" sx={{ fontSize: '0.9rem' }}>
                        Optional
                      </Typography>
                    ) // Tăng kích thước chữ cho phần "Optional"
                  }
                  if (isStepSkipped(index)) {
                    stepProps.completed = false
                  }
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps} sx={{ fontSize: '1.2rem', padding: '8px' }}>
                        {label}
                      </StepLabel>
                    </Step>
                  )
                })}
              </Stepper>
              {activeStep === steps.length ? (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1, fontSize: '1.1rem' }}>
                    All steps completed - you&apos;re finished
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    <Button onClick={handleReset} sx={{ fontSize: '1rem' }}>
                      Reset
                    </Button>
                  </Box>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Typography sx={{ mt: 2, mb: 1, fontSize: '1.1rem' }}>Step {activeStep + 1}</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Button
                      color="inherit"
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1, fontSize: '1rem', padding: '8px 16px' }} // Tăng kích thước nút Back
                    >
                      Back
                    </Button>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {isStepOptional(activeStep) && (
                      <Button
                        color="inherit"
                        onClick={handleSkip}
                        sx={{ mr: 1, fontSize: '1rem', padding: '8px 16px' }} // Tăng kích thước nút Skip
                      >
                        Skip
                      </Button>
                    )}
                    <Button
                      onClick={handleNext}
                      sx={{ fontSize: '1rem', padding: '8px 16px' }} // Tăng kích thước nút Next/Finish
                    >
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </Box>
                </React.Fragment>
              )}
            </Box>
            {activeStep === 0 && (
              <div className={cx('ticket-selector')}>
                <div className={cx('head')}>
                  <div className={cx('title')}>
                    DANH SÁCH CÁC PHÒNG THUỘC TÒA {room && room.name ? room.name.toUpperCase() : ''}
                  </div>
                  <div>
                    <FontAwesomeIcon icon={faXmark} className={cx('icon-hide-popup')} onClick={hanleHidePopup} />
                  </div>
                </div>
                <div className={cx('seats')}>
                  <div className={cx('status')}>
                    <div className={cx('item')}>Available</div>
                    <div className={cx('item')}>Booked</div>
                    <div className={cx('item')}>Selected</div>
                  </div>
                  <div className={cx('all-seats')}>
                    {room.officeDTOS &&
                      room.officeDTOS.map((f) => (
                        <div key={f.id}>
                          <input
                            ref={inputRefs.current[`inputRef${f.id}`]}
                            type="checkbox"
                            name="tickets"
                            id={f.id}
                            value={valueInputs[`valueInput${f.id}`]}
                            onChange={() => changeInput(f.id)}
                          />
                          <label ref={labelRefs.current[`labelRef${f.id}`]} htmlFor={f.id} className={cx('seat')}>
                            <span className={cx('value-label')}>{f.id}</span>
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
                <div className={cx('total')}>
                <span className={cx('title-count')}>
                  {' '}
                  <span className={cx('count')}>{selectedIds.length}</span> Floors selected{' '}
                </span>
                <div className={cx('amount')}>0</div>
              </div>
              </div>
              
            )}
            {activeStep === 1 && (
              <div className={cx('ticket-selector-manager')}>
                 <div className={cx('title-manager')}>
                    DANH SÁCH QUẢN LÍ TÒA NHÀ {room && room.name ? room.name.toUpperCase() : ''}
                  </div>
                <div className={cx('head')}>
                  <div>
                    <FontAwesomeIcon icon={faXmark} className={cx('icon-hide-popup')} onClick={hanleHidePopup} />
                  </div>
                  <div>
                    <Grid container spacing={2}>
                      {managers.map((item) => (
                        <Grid item xs={12} sm={6} md={3} key={item.id}>
                          <Card>
                            {/* Hàng 1: Hình ảnh */}
                            <CardMedia 
                              component="img" 
                              height="150" 
                              image={item.imageAvatar} 
                              alt={item.text} 
                              sx={{
                                height: 100,
                                width: 100,
                                borderRadius: "50%",
                                margin: "16px auto",
                              }}
                           />

                            {/* Hàng 2: Văn bản */}
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                {item.fullName}
                              </Typography>

                              {/* Hàng 3: Checkbox */}
                              <FormControlLabel control={<Checkbox color="primary" />} label="Chọn" />

                              {/* Hàng 4: Nút */}
                              <Button 
                                variant="contained" 
                                color="red" 
                                fullWidth
                                sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'darkred' }, color: 'white'}} 
                                >
                                Xem chi tiết
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                </div>
              </div>
            )}
                        {activeStep === 2 && (
              <div className={cx('ticket-selector-manager')}>
                 <div className={cx('title-manager')}>
                    XÁC NHẬN YÊU CẦU ĐẶT PHÒNG TẠI {room && room.name ? room.name.toUpperCase() : ''}
                  </div>
                <div className={cx('head')}>
                  <div>
                    <FontAwesomeIcon icon={faXmark} className={cx('icon-hide-popup')} onClick={hanleHidePopup} />
                  </div>
                  
                </div>
              </div>
            )}
            <div className={cx('price')}>
              {/* <Button
                onClick={BookFloor}
                variant="contained"
                sx={{ backgroundColor: 'blue', '&:hover': { backgroundColor: 'blue' } }} // Tùy chỉnh màu nền
              >
                Gửi yêu cầu
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    );
}

export default ModalOrderRoom;



{/* <div>
      <ModalOrderRoom
        activeStep={activeStep}
        steps={steps}
        room={room}
        managers={managers}
        selectedIds={selectedIds}
        valueInputs={valueInputs}
        handleNext={handleNext}
        handleBack={handleBack}
        handleReset={handleReset}
        isStepOptional = {isStepOptional}
        isStepSkipped = {isStepSkipped}
        handleSkip = {handleSkip}
        hanleHidePopup={hanleHidePopup}
        changeInput={changeInput}
        showListFloor={showListFloor}
        showListFloorMain={showListFloorMain}
        inputRefs={inputRefs}
        labelRefs={labelRefs}
      />
      </div> */}