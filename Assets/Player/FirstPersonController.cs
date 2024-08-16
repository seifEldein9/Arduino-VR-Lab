using UnityEngine;

public class FirstPersonController : MonoBehaviour
{
    public float speed = 5f;           // سرعة الحركة
    public float sensitivity = 2f;     // حساسية الماوس
    public float verticalLookLimit = 80f; // الحد الأقصى لتحريك الرأس عموديًا

    private CharacterController controller;
    private float verticalRotation = 0f;
    private Camera playerCamera;

    void Start()
    {
        controller = GetComponent<CharacterController>();
        playerCamera = Camera.main; // التأكد من أن الكاميرا هي الكاميرا الرئيسية
    }

    void Update()
    {
        if (Input.GetMouseButton(1)) // التحقق إذا كان الزر الأيمن للماوس مضغوطًا
        {
            // تحريك الكاميرا عموديًا
            float mouseX = Input.GetAxis("Mouse X") * sensitivity;
            float mouseY = -Input.GetAxis("Mouse Y") * sensitivity;

            verticalRotation += mouseY;
            verticalRotation = Mathf.Clamp(verticalRotation, -verticalLookLimit, verticalLookLimit);
            playerCamera.transform.localRotation = Quaternion.Euler(verticalRotation, 0, 0);
            transform.rotation *= Quaternion.Euler(0, mouseX, 0);
        }

        // تحريك اللاعب
        float moveDirectionY = controller.velocity.y;
        Vector3 move = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
        move = transform.TransformDirection(move);
        move *= speed;
        move.y = moveDirectionY;

        controller.Move(move * Time.deltaTime);
    }
}
