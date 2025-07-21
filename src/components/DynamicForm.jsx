import React, { useState } from "react";
import {
  Input,
  Select,
  Checkbox,
  Button,
  Card,
  Typography,
  Space,
  Divider,
} from "antd";

const { Option } = Select;
const { Title } = Typography;

const FIELD_TYPES = ["string", "number", "nested"];

const generateEmptyField = () => ({
  key: "",
  type: "string",
  required: false,
  children: [],
});

const Field = ({ field, onChange, onDelete, level = 0 }) => {
  const handleChange = (prop, value) => {
    const updated = { ...field, [prop]: value };
    if (prop === "type" && value !== "nested") {
      updated.children = [];
    }
    onChange(updated);
  };

  const updateChild = (index, child) => {
    const newChildren = [...field.children];
    newChildren[index] = child;
    onChange({ ...field, children: newChildren });
  };

  const addChild = () => {
    onChange({ ...field, children: [...field.children, generateEmptyField()] });
  };

  const deleteChild = (index) => {
    const newChildren = [...field.children];
    newChildren.splice(index, 1);
    onChange({ ...field, children: newChildren });
  };

  return (
    <Card
      size="small"
      style={{
        marginBottom: 16,
        marginLeft: level * 20,
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <Space align="start" wrap style={{ width: "100%" }}>
        <Input
          placeholder="Field name"
          value={field.key}
          onChange={(e) => handleChange("key", e.target.value)}
          style={{ width: 160 }}
        />
        <Select
          value={field.type}
          onChange={(value) => handleChange("type", value)}
          style={{ width: 130 }}
        >
          {FIELD_TYPES.map((type) => (
            <Option key={type} value={type}>
              {type.toUpperCase()}
            </Option>
          ))}
        </Select>
        <Checkbox
          checked={field.required}
          onChange={(e) => handleChange("required", e.target.checked)}
        >
          Required
        </Checkbox>
        <Button danger onClick={onDelete}>
          Delete
        </Button>
      </Space>

      {field.type === "nested" && (
        <div style={{ marginTop: 12 }}>
          <Button onClick={addChild} type="dashed" size="small">
            + Add Nested Field
          </Button>
          <div style={{ marginTop: 12 }}>
            {field.children.map((child, index) => (
              <Field
                key={index}
                field={child}
                onChange={(updated) => updateChild(index, updated)}
                onDelete={() => deleteChild(index)}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

const DynamicForm = () => {
  const [fields, setFields] = useState([generateEmptyField()]);

  const updateField = (index, updatedField) => {
    const newFields = [...fields];
    newFields[index] = updatedField;
    setFields(newFields);
  };

  const addField = () => {
    setFields([...fields, generateEmptyField()]);
  };

  const deleteField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };

  const buildJson = (fieldsArray) => {
    const result = {};
    fieldsArray.forEach((field) => {
      if (!field.key) return;
      if (field.type === "nested") {
        result[field.key] = buildJson(field.children);
      } else {
        result[field.key] = field.type.toUpperCase();
      }
    });
    return result;
  };

  return (

    <div style={{
      padding: "40px",
      background: "#f0f2f5",
      minHeight: "100vh",
      width: "100vw",
      boxSizing: "border-box",
    }}>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "40px",
          width: "100%",
        }}
      >

        {/* Form Editor */}
        <div style={{ flex: 1 }}>
          <Title level={4}> JSON Schema Builder</Title>
          <Divider />
          {fields.map((field, index) => (
            <Field
              key={index}
              field={field}
              onChange={(updated) => updateField(index, updated)}
              onDelete={() => deleteField(index)}
            />
          ))}
          <Button onClick={addField} type="primary" block>
            + Add Field
          </Button>
        </div>

        {/* JSON Preview */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Title level={4}> Live JSON Preview</Title>
          <Divider />
          <pre
            style={{
              background: "#1e1e1e",
              color: "#fff",
              padding: 20,
              borderRadius: 8,
              fontSize: 14,
              minHeight: 300,
              maxHeight: 500,
              overflow: "auto",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(buildJson(fields), null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default DynamicForm;





