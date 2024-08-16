using UnityEngine;

public class Battery : MonoBehaviour
{
    public float voltage = 5.0f;  // الجهد الكهربائي للبطارية

    public Transform positiveTerminal;  // القطب الموجب
    public Transform negativeTerminal;  // القطب السالب
}
