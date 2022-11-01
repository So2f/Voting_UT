// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.5.16;

contract SimpleStorage {

    uint storageData;

    function get() public view returns(uint) {
        return storageData;
    }

    function set(uint n) public {
        storageData = n;
    }
}