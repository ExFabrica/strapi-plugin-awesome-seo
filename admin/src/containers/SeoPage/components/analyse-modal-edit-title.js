
import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

//Modal
import { ModalLayout, ModalHeader, ModalFooter, ModalBody } from '@strapi/design-system/ModalLayout';
//Typo
import { Typography } from '@strapi/design-system/Typography';
//Button
import { Button } from '@strapi/design-system/Button';
//Text Input
import { TextInput } from '@strapi/design-system/TextInput';

export const ModalEditTitle = (props) => {
  return <>
    {props.isVisible && <ModalLayout onClose={props.onClose} labelledBy="title">
      <ModalHeader>
        <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
          Custom the front url title
        </Typography>
      </ModalHeader>
      <ModalBody>
        <TextInput
          label="New title"
          name="newTile"
          placeholder={"new title"}
          onChange={({ target: { value } }) => {
            /*setSettings((prevState) => {
              return { ...prevState, frontUrl: value };
            });*/
          }}
          value={props.value}
          hint={'The name of the url you want to custom'}
        />
      </ModalBody>
      <ModalFooter startActions={<Button onClick={props.onClose} variant="tertiary">
        Cancel
      </Button>} endActions={<>
        <Button onClick={props.onSave}>Save</Button>
      </>} />
    </ModalLayout>}
  </>;
}

ModalEditTitle.defaultProps = {
  onClose: () => { console.log("modal is closing!") },
  onSave: () => { console.log("saving!") },
  isVisible: false,
  value: ""
};

ModalEditTitle.propTypes = {
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  isVisible: PropTypes.bool,
  value: PropTypes.string
};