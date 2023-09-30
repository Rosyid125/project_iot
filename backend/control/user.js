import user from "../model/UserModel.js";
import argon2 from "argon2";

export const createUser = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  if (password != confPassword) {
    return res.status(400).json({ msg: "Password tidak sesuai dengan konfirmasi password" });
  }
  const hashPassword = await argon2.hash(password);
  try {
    await user.create({
      name: name,
      email: email,
      password: hashPassword,
      role: role,
    });
    res.status(201).json({ msg: "register berhasil" });
  } catch (error) {
    res.status(500).json({ msg: error.maessage });
  }
};
export const getUser = async (req, res) => {
  try {
    const response = await user.findAll({
      attributes: ["uuid", "name", "email", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.maessage });
  }
};
export const geteUserById = async (req, res) => {
  try {
    const response = await user.findOne({
      attributes: ["uuid", "name", "email", "role"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.maessage });
  }
};

export const updateUser = async (req, res) => {
  const User = await user.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!User) return res.status(404).json({ msg: "User tidak ditemukan" });
  const { name, email, password, confPassword, role } = req.body;
  let heshPassword;
  if (password === "" || password === null) {
    heshPassword = user.password;
  } else {
    heshPassword = await argon2.hash(password);
  }
  if (password !== confPassword) return res.status(400).json({ msg: "Password Tidak Cocok" });
  try {
    await User.update(
      {
        name: name,
        email: email,
        password: heshPassword,
        role: role,
      },
      {
        where: {
          id: User.id,
        },
      }
    );
    res.status(200).json({ msg: "user updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
export const deleteUser = async (req, res) => {
  const User = await user.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!User) return res.status(404).json({ msg: "User tidak ditemukan" });
  try {
    await User.destroy({
      where: {
        id: User.id,
      },
    });
    res.status(200).json({ msg: "user Deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
