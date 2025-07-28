import { Rol } from '../models/index.js';
 
export const getRoles = async (req, res) => {
  const roles = await Rol.findAll();
  res.json(roles);
}; 